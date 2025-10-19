package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"okusuri-backend/internal/dto"
	"okusuri-backend/internal/model"
	"okusuri-backend/internal/repository"
	"okusuri-backend/internal/service"
)

type NotificationHandler struct {
	notificationRepo *repository.NotificationRepository
	userRepo         *repository.UserRepository
	notificationSvc  *service.NotificationService
}

const dummyUserID = "dummy-user" // TODO: 認証実装時に差し替え

func NewNotificationHandler(
	notificationRepo *repository.NotificationRepository,
	userRepo *repository.UserRepository,
) *NotificationHandler {
	return &NotificationHandler{
		notificationRepo: notificationRepo,
		userRepo:         userRepo,
		notificationSvc:  service.NewNotificationService(),
	}
}

func (h *NotificationHandler) getNotificationService() *service.NotificationService {
	if h.notificationSvc == nil {
		h.notificationSvc = service.NewNotificationService()
	}
	return h.notificationSvc
}

// GetSetting は通知設定を取得するハンドラー
func (h *NotificationHandler) GetSetting(c *gin.Context) {
	// 通知設定を取得
	setting, err := h.notificationRepo.GetSettingByUserID(dummyUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get notification setting"})
		return
	}

	c.JSON(http.StatusOK, setting)
}

// RegisterSetting は通知設定を登録するハンドラー
func (h *NotificationHandler) RegisterSetting(c *gin.Context) {
	userID := dummyUserID

	// リクエストボディから通知設定を取得
	var req dto.RegisterNotificationSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// 通知設定をモデルに変換
	setting := model.NotificationSetting{
		UserID:       userID,
		IsEnabled:    req.IsEnabled,
		Platform:     req.Platform,
		Subscription: req.Subscription,
	}

	// リポジトリに登録処理を依頼
	if err := h.notificationRepo.RegisterSetting(&setting); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register notification setting"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "notification setting registered successfully"})
}

// SendNotification は通知を送信するハンドラー
func (h *NotificationHandler) SendNotification(c *gin.Context) {
	requestTime := time.Now()
	h.logRequestStart(c, requestTime)

	users, settings, err := h.fetchUsersAndSettings(c)
	if err != nil {
		return
	}

	settingsMap := h.buildSettingsMap(settings)
	sentCount := h.processNotifications(users, settingsMap)

	h.logAndRespond(c, requestTime, sentCount)
}

// logRequestStart はリクエスト開始時のログを出力する
func (h *NotificationHandler) logRequestStart(c *gin.Context, requestTime time.Time) {
	fmt.Printf("\n========== 通知送信処理開始 [%s] ==========\n", requestTime.Format("2006-01-02 15:04:05"))
	fmt.Printf("リクエストパス: %s\n", c.Request.URL.Path)
	fmt.Printf("リクエスト元IP: %s\n", c.ClientIP())
	fmt.Printf("リクエストID: %s\n", c.Writer.Header().Get("Request-ID"))
}

// fetchUsersAndSettings はユーザーと通知設定を取得する
func (h *NotificationHandler) fetchUsersAndSettings(c *gin.Context) ([]model.User, []model.NotificationSetting, error) {
	users, userErr := h.userRepo.GetAllUsers()
	if userErr != nil {
		fmt.Printf("エラー: ユーザー取得失敗: %v\n", userErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get users"})
		return nil, nil, userErr
	}
	fmt.Printf("取得したユーザー数: %d\n", len(users))

	settings, settingsErr := h.notificationRepo.GetAllSettings()
	if settingsErr != nil {
		fmt.Printf("エラー: 通知設定取得失敗: %v\n", settingsErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get notification settings"})
		return nil, nil, settingsErr
	}
	fmt.Printf("取得した通知設定数: %d\n", len(settings))

	return users, settings, nil
}

// buildSettingsMap は通知設定をユーザーIDでマップ化する
func (h *NotificationHandler) buildSettingsMap(
	settings []model.NotificationSetting,
) map[string]model.NotificationSetting {
	settingsMap := make(map[string]model.NotificationSetting)
	for _, setting := range settings {
		existingSetting, exists := settingsMap[setting.UserID]
		if !exists || setting.UpdatedAt.After(existingSetting.UpdatedAt) {
			settingsMap[setting.UserID] = setting
		}
	}
	fmt.Printf("通知対象ユーザー数: %d\n", len(settingsMap))
	return settingsMap
}

// processNotifications は各ユーザーに通知を送信する
func (h *NotificationHandler) processNotifications(
	users []model.User, settingsMap map[string]model.NotificationSetting,
) int {
	sentSubs := make(map[string]bool)
	fmt.Println("----- 通知送信処理開始 -----")

	for _, user := range users {
		if h.sendUserNotification(user, settingsMap, sentSubs) {
			fmt.Printf("ユーザーID: %s への通知送信成功\n", user.ID)
		}
	}

	fmt.Printf("----- 通知送信処理完了: 合計%d件送信 -----\n", len(sentSubs))
	return len(sentSubs)
}

// sendUserNotification は個別ユーザーに通知を送信する
func (h *NotificationHandler) sendUserNotification(
	user model.User, settingsMap map[string]model.NotificationSetting, sentSubs map[string]bool,
) bool {
	setting, ok := settingsMap[user.ID]
	if !ok || !setting.IsEnabled {
		return false
	}

	if _, alreadySent := sentSubs[setting.Subscription]; alreadySent && setting.Subscription != "" {
		return false
	}

	message := "お薬の時間です。忘れずに服用してください。"

	sendErr := h.getNotificationService().SendNotificationWithDays(user, setting, message, 0)
	if sendErr != nil {
		fmt.Printf("エラー: ユーザーID=%s への通知送信失敗: %v\n", user.ID, sendErr)
		return false
	}

	sentSubs[setting.Subscription] = true
	return true
}

// logAndRespond は処理結果をログ出力してレスポンスを返す
func (h *NotificationHandler) logAndRespond(c *gin.Context, requestTime time.Time, sentCount int) {
	processingTime := time.Since(requestTime)
	fmt.Printf("処理時間: %v\n", processingTime)

	c.JSON(http.StatusOK, gin.H{
		"message":         "notification sent successfully",
		"sent_count":      sentCount,
		"process_time_ms": processingTime.Milliseconds(),
	})
	fmt.Printf("========== 通知送信処理終了 [%s] ==========\n\n",
		time.Now().Format("2006-01-02 15:04:05"))
}

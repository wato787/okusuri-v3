package handler

import (
	"net/http"
	"okusuri-backend/internal/dto"
	"okusuri-backend/internal/model"
	"okusuri-backend/internal/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MedicationHandler struct {
	medicationRepo *repository.MedicationRepository
}

func NewMedicationHandler(medicationRepo *repository.MedicationRepository) *MedicationHandler {
	return &MedicationHandler{
		medicationRepo: medicationRepo,
	}
}

func (h *MedicationHandler) RegisterLog(c *gin.Context) {
	// リクエストボディを構造体にバインド
	var req dto.MedicationLogRequest
	if bindErr := c.ShouldBindJSON(&req); bindErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	medicationLog := model.MedicationLog{
		UserID:      dummyUserID,
		HasBleeding: req.HasBleeding,
	}

	// 日付が指定されている場合は、その日付を使用
	if req.Date != nil {
		medicationLog.CreatedAt = *req.Date
	}

	// リポジトリを直接呼び出す
	if err := h.medicationRepo.RegisterLog(medicationLog.UserID, medicationLog); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register medication log"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "medication log registered successfully"})
}

// GetLogs はユーザーの服用記録を取得するハンドラー
func (h *MedicationHandler) GetLogs(c *gin.Context) {
	// 服用記録を取得
	logs, err := h.medicationRepo.GetLogsByUserID("dummy-user") // TODO: 認証実装時に差し替え
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get medication logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

// GetLogByID は特定のIDの服薬ログを取得するハンドラー
func (h *MedicationHandler) GetLogByID(c *gin.Context) {
	// URLからIDパラメータを取得
	logIDStr := c.Param("id")
	logID, err := strconv.ParseUint(logIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid log ID"})
		return
	}

	// 服薬ログを取得
	log, err := h.medicationRepo.GetLogByID("dummy-user", uint(logID)) // TODO: 認証実装時に差し替え
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "medication log not found"})
		return
	}

	c.JSON(http.StatusOK, log)
}

// UpdateLog は指定されたIDの服薬ログを更新するハンドラー
func (h *MedicationHandler) UpdateLog(c *gin.Context) {
	// URLからIDパラメータを取得
	logIDStr := c.Param("id")
	logID, err := strconv.ParseUint(logIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid log ID"})
		return
	}

	// リクエストボディを構造体にバインド
	var req dto.MedicationLogRequest
	if bindErr := c.ShouldBindJSON(&req); bindErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	err = h.medicationRepo.UpdateLog("dummy-user", uint(logID), req.HasBleeding) // TODO: 認証実装時に差し替え
	if err != nil {
		if err.Error() == "log not found or user not authorized" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update medication log"})
		return

	}

	c.JSON(http.StatusOK, dto.BaseResponse{
		Success: true,
		Message: "medication log updated successfully",
	})
}

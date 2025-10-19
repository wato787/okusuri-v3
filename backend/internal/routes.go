package internal

import (
	"okusuri-backend/internal/handler"
	"okusuri-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	// リポジトリの初期化
	userRepo := repository.NewUserRepository()
	medicationRepo := repository.NewMedicationRepository()
	notificationRepo := repository.NewNotificationRepository()

	// ハンドラーの初期化
	medicationHandler := handler.NewMedicationHandler(medicationRepo)
	notificationHandler := handler.NewNotificationHandler(
		notificationRepo,
		userRepo,
	)

	// Ginのルーターを作成
	router := gin.Default()

	// グローバルミドルウェアの設定
	api := router.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status": "ok",
			})
		})

		api.POST(("/notification"), notificationHandler.SendNotification)

		notificationSetting := api.Group("/notification/setting")
		{
			notificationSetting.GET("", notificationHandler.GetSetting)
			notificationSetting.POST("", notificationHandler.RegisterSetting)
		}

		medicationLog := api.Group("/medication-log")
		{
			medicationLog.POST("", medicationHandler.RegisterLog)
			medicationLog.GET("", medicationHandler.GetLogs)
			medicationLog.GET("/:id", medicationHandler.GetLogByID)
			medicationLog.PATCH("/:id", medicationHandler.UpdateLog)
		}
	}

	return router
}

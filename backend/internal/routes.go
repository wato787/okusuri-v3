package internal

import (
	"net/http"

	"okusuri-backend/internal/handler"
	"okusuri-backend/internal/middleware"
	"okusuri-backend/internal/repository"

	"github.com/labstack/echo/v4"
)

func SetupRoutes() *echo.Echo {
	userRepo := repository.NewUserRepository()
	medicationRepo := repository.NewMedicationRepository()
	notificationRepo := repository.NewNotificationRepository()

	medicationHandler := handler.NewMedicationHandler(medicationRepo)
	notificationHandler := handler.NewNotificationHandler(notificationRepo, userRepo)

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())

	api := e.Group("/api")
	api.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	api.POST("/notification", notificationHandler.SendNotification)

	notificationSetting := api.Group("/notification/setting")
	notificationSetting.GET("", notificationHandler.GetSetting)
	notificationSetting.POST("", notificationHandler.RegisterSetting)

	medicationLog := api.Group("/medication-log")
	medicationLog.POST("", medicationHandler.RegisterLog)
	medicationLog.GET("", medicationHandler.GetLogs)
	medicationLog.GET("/:id", medicationHandler.GetLogByID)
	medicationLog.PATCH("/:id", medicationHandler.UpdateLog)

	return e
}

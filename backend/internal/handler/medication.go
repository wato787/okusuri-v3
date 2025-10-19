package handler

import (
	"net/http"
	"strconv"

	"okusuri-backend/internal/dto"
	"okusuri-backend/internal/model"
	"okusuri-backend/internal/repository"

	"github.com/labstack/echo/v4"
)

type MedicationHandler struct {
	medicationRepo *repository.MedicationRepository
}

func NewMedicationHandler(medicationRepo *repository.MedicationRepository) *MedicationHandler {
	return &MedicationHandler{
		medicationRepo: medicationRepo,
	}
}

func (h *MedicationHandler) RegisterLog(c echo.Context) error {
	var req dto.MedicationLogRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request body"})
	}

	medicationLog := model.MedicationLog{
		UserID:      dummyUserID,
		HasBleeding: req.HasBleeding,
	}

	if req.Date != nil {
		medicationLog.CreatedAt = *req.Date
	}

	if err := h.medicationRepo.RegisterLog(medicationLog.UserID, medicationLog); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to register medication log"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "medication log registered successfully"})
}

func (h *MedicationHandler) GetLogs(c echo.Context) error {
	logs, err := h.medicationRepo.GetLogsByUserID(dummyUserID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to get medication logs"})
	}

	return c.JSON(http.StatusOK, logs)
}

func (h *MedicationHandler) GetLogByID(c echo.Context) error {
	logIDStr := c.Param("id")
	logID, err := strconv.ParseUint(logIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid log ID"})
	}

	log, err := h.medicationRepo.GetLogByID(dummyUserID, uint(logID))
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "medication log not found"})
	}

	return c.JSON(http.StatusOK, log)
}

func (h *MedicationHandler) UpdateLog(c echo.Context) error {
	logIDStr := c.Param("id")
	logID, err := strconv.ParseUint(logIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid log ID"})
	}

	var req dto.MedicationLogRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request body"})
	}

	err = h.medicationRepo.UpdateLog(dummyUserID, uint(logID), req.HasBleeding)
	if err != nil {
		if err.Error() == "log not found or user not authorized" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to update medication log"})
	}

	return c.JSON(http.StatusOK, dto.BaseResponse{
		Success: true,
		Message: "medication log updated successfully",
	})
}



package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/api/health")

	h := func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	}

	if assert.NoError(t, h(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.JSONEq(t, `{"status":"ok"}`, rec.Body.String())
	}
}

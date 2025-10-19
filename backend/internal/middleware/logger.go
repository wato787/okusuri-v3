package middleware

import (
	"log"
	"time"

	"github.com/labstack/echo/v4"
)

func Logger() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			start := time.Now()
			path := c.Request().URL.Path

			if err := next(c); err != nil {
				c.Error(err)
			}

			latency := time.Since(start)
			status := c.Response().Status
			log.Printf("| %3d | %13v | %s", status, latency, path)
			return nil
		}
	}
}

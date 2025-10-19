package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func CORS() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			res := c.Response()
			req := c.Request()

			res.Header().Set("Access-Control-Allow-Origin", "*")
			res.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			res.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if req.Method == http.MethodOptions {
				res.WriteHeader(http.StatusNoContent)
				return nil
			}

			return next(c)
		}
	}
}

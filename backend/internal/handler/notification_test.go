package handler

import "testing"

func TestNotificationHandler_New(t *testing.T) {
	t.Run("NotificationHandlerが正常に作成される", func(t *testing.T) {
		if NewNotificationHandler(nil, nil) == nil {
			t.Fatal("expected handler instance, got nil")
		}
	})
}

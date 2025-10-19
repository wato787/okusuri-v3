package model

import "time"

// User モデル
type User struct {
	ID            string    `json:"id" gorm:"primary_key"`
	Name          string    `json:"name"`
	Email         string    `json:"email" gorm:"unique"`
	EmailVerified bool      `json:"emailVerified"`
	Image         *string   `json:"image"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func (User) TableName() string {
	return "user"
}

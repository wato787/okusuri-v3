package repository

import (
	"okusuri-backend/internal/model"
	"okusuri-backend/pkg/config"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository() *UserRepository {
	return &UserRepository{db: config.DB}
}

// GetAllUsers は全ユーザーを取得
func (r *UserRepository) GetAllUsers() ([]model.User, error) {
	var users []model.User

	// ユーザーを取得
	if err := r.db.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

// FindByID はIDでユーザーを検索
func (r *UserRepository) FindByID(id string) (*model.User, error) {
	var user model.User
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByEmail はメールアドレスでユーザーを検索
func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Create はユーザーを作成
func (r *UserRepository) Create(user *model.User) error {
	return r.db.Create(user).Error
}

// Update はユーザーを更新
func (r *UserRepository) Update(user *model.User) error {
	return r.db.Save(user).Error
}

// Delete はユーザーを削除
func (r *UserRepository) Delete(id string) error {
	return r.db.Delete(&model.User{}, "id = ?", id).Error
}

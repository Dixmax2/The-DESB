package model

type PasswordRecover struct {
	ID    uint
	Email string
	Token string `gorm:"unique"`
}

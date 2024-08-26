package model

import (
	"time"
)

type User struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	Name      string     `json:"name" gorm:"not null;column:name;size:255;unique"`
	Email     string     `json:"email" gorm:"not null;column:email;size:255"`
	Role      string     `json:"role" gorm:"not null;column:role;size:255"`
	Avatar    *string    `json:"avatar" gorm:"column:avatar;size:255"`
	CreatedAt time.Time  `json:"created_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
	Password  []byte     `json:"password" gorm:"not null;column:password;size:255"`
	Productos []Producto `gorm:"many2many:project_assignments;"`
}

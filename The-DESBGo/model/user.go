package model

type User struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	Name      string     `json:"name" gorm:"not null;column:name;size:255"`
	Email     string     `json:"email" gorm:"not null;column:email;size:255"`
	Role      string     `json:"role" gorm:"not null;column:role;size:255"`
	Password  []byte     `json:"password" gorm:"not null;column:password;size:255"`
	Productos []Producto `gorm:"many2many:project_assignments;"`
}

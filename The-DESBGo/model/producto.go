package model

type Producto struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	Name            string    `json:"name" gorm:"not null;column:name;size:255"`
	Descripcion     string    `json:"descripcion" gorm:"not null;column:descripcion;size:255"`
	FechaCreacion   string    `json:"fechaCreacion" gorm:"not null;column:fechaCreacion;size:255"`
	Precio          string    `json:"precio" gorm:"not null;column:precio;size:255"`
	Miniatura       string    `json:"miniatura" gorm:"not null;column:miniatura;size:255"`
	Archivado       bool      `json:"archivado" gorm:"not null;column:archivado"`
	FechaExpiracion string    `json:"fechaExpiracion" gorm:"not null;column:fechaExpiracion;size:255"`
	IfcFiles        []IfcFile `gorm:"foreignKey:ProjectID"`
	Users           []User    `gorm:"many2many:project_assignments;"`
}

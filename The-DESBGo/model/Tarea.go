package model

type Tarea struct {
	ID            uint   `json:"id" gorm:"primaryKey"`
	Name          string `json:"name" gorm:"not null;column:name;size:255"`
	Descripcion   string `json:"descripcion" gorm:"not null;column:descripcion;size:255"`
	FechaCreacion string `json:"fechaCreacion" gorm:"not null;column:fechaCreacion;size:255"`
	FechaLimite   string `json:"fechaLimite" gorm:"not null;column:fechaLimite;size:255"`
	Prioridad     string `json:"prioridad" gorm:"not null;column:prioridad;size:255"`
	Tipo          string `json:"tipo" gorm:"not null;column:tipo;size:255"`
	UrlTarea      string `json:"urlTarea" gorm:"not null;column:urlTarea;size:255"`
	ProyectoID    string `json:"proyectoId" gorm:"not null"`
	Users         string `gorm:"many2many:project_assignments;"`
	Estado        string `json:"estado" gorm:"not null;column:estado;size:255"`
}

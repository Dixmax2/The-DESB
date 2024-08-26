package model

type IfcFile struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	ProjectID   uint   `json:"projectId" gorm:"index;not null"`
	IfcURL      string `json:"ifcUrl" gorm:"not null;column:ifcUrl;size:255"`
	IsFirstLoad bool   `json:"isFirstLoad" gorm:"not null;default:false"`
	NameUser    string `json:"nameUser" gorm:"not null;column:nameUser;size:255"`
	Version     string `json:"version" gorm:"not null;column:version;size:255"`
	Tamaño      string `json:"tamaño" gorm:"not null;column:tamaño;size:255"`
	FechCreate  string `json:"fechCreate" gorm:"not null;column:fechCreate;size:255"`
}

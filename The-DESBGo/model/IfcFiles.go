package model

type IfcFile struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	ProjectID   uint   `json:"projectId" gorm:"index;not null"`
	IfcURL      string `json:"ifcUrl" gorm:"not null;column:ifcUrl;size:255"`
	IsFirstLoad bool   `json:"isFirstLoad" gorm:"not null;default:false"`
}

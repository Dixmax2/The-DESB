package model

import "time"

type Messages struct {
	Sender    string    `json:"sender"`
	UserID    int       `json:"user_id"`
	Avatar    string    `json:"avatar"`
	RoomID    string    `json:"room_id"`
	Content   string    `json:"content"`
	Image     string    `json:"image"`
	ImageName string    `json:"image_name"`
	CreatedAt time.Time `json:"created_at"`
}

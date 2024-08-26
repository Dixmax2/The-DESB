package model

import "time"

type Messages struct {
	ID        int       `json:"id"`
	Sender    string    `json:"sender"`
	UserID    int       `json:"user_id"`
	Avatar    string    `json:"avatar"`
	RoomID    string    `json:"room_id"`
	Content   string    `json:"content"`
	Image     string    `json:"image"`
	CreatedAt time.Time `json:"Created_at"`
}

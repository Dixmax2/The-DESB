package model

import "github.com/gofiber/websocket/v2"

type Message struct {
	Sender    string `json:"sender"`
	Content   string `json:"content"`
	UserID    int    `json:"user_id"`
	Avatar    string `json:"avatar"`
	RoomID    string `json:"room_id"` // Identificador de la sala de chat
	CreatedAt string `json:"Created_at"`
	Image     string `json:"image"`
	ImageName string `json:"imageName"`
}

type Room struct {
	ID      string
	Clients map[*websocket.Conn]bool
}

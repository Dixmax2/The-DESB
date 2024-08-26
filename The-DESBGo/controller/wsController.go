package controller

import (
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"principal/database"
	"principal/model"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var rooms = make(map[string]*model.Room) // Mapa de salas de chat
var broadcast = make(chan model.Message) // Canal de mensajes entrantes

func HandleConnections(c *websocket.Conn) {
	// Cerrar la conexión cuando la función termine
	defer c.Close()

	// Leer el ID de la sala de chat del mensaje inicial
	var initialMsg model.Message
	err := c.ReadJSON(&initialMsg)
	if err != nil {
		log.Printf("Error reading initial message: %v", err)
		return
	}

	roomID := initialMsg.RoomID
	room, exists := rooms[roomID]
	if !exists {
		room = &model.Room{
			ID:      roomID,
			Clients: make(map[*websocket.Conn]bool),
		}
		rooms[roomID] = room
	}
	room.Clients[c] = true
	fmt.Println("Client connected to room", roomID)

	// Bucle para escuchar nuevos mensajes
	for {
		var msg model.Message
		err := c.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			delete(room.Clients, c)
			break
		}
		// Enviar el mensaje al canal de broadcast
		broadcast <- msg
	}
}

func HandleMessages() {
	// Bucle para enviar mensajes a las salas de chat
	for {
		msg := <-broadcast

		// Decodificar la imagen base64 antes de guardarla en la base de datos
		if msg.Image != "" {
			fmt.Println(msg.Image)
			fmt.Println(msg.ImageName)

			// Verificar la extensión de la imagen
			splitFileName := strings.Split(msg.ImageName, ".")
			extensionImg := splitFileName[len(splitFileName)-1]

			imgData, err := base64.StdEncoding.DecodeString(msg.Image)
			if err != nil {
				log.Printf("Error decoding image: %v", err)
				continue
			}

			// Crear un nombre de archivo único usando timestamp
			fileName := fmt.Sprintf("%d."+extensionImg, time.Now().UnixNano())
			filePath := filepath.Join("projects", msg.RoomID, "messages", fileName)

			// Crear el directorio si no existe
			if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
				log.Printf("Error creating directory: %v", err)
				continue
			}

			// Guardar la imagen en el sistema de archivos
			if err := os.WriteFile(filePath, imgData, 0644); err != nil {
				log.Printf("Error writing image file: %v", err)
				continue
			}

			// Actualizar msg.Image para que contenga el nombre del archivo
			msg.Image = fileName
			fmt.Println(msg.Image)
		}

		_, err := database.DB.Exec("INSERT INTO messages (sender, user_id, avatar, proyecto_id, content, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", msg.Sender, msg.UserID, msg.Avatar, msg.RoomID, msg.Content, msg.Image, msg.CreatedAt)
		if err != nil {
			log.Printf("Error inserting message into database: %v", err)
		}

		room, exists := rooms[msg.RoomID]
		if exists {
			for client := range room.Clients {
				err := client.WriteJSON(msg)
				if err != nil {
					log.Printf("Error writing message: %v", err)
					client.Close()
					delete(room.Clients, client)
				}
			}
		}
		fmt.Println(msg)
	}
}

func GetMessages(c *fiber.Ctx) error {
	// Analizar el cuerpo de la solicitud para obtener el ID del proyecto
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Consultar todos los mensajes asociados al proyecto, ordenados por fecha de creación
	rows, err := database.DB.Query("SELECT sender, user_id, avatar, proyecto_id, content, image, created_at FROM messages WHERE proyecto_id = ?", data["projectID"])
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error retrieving messages from database"})
	}
	defer rows.Close()

	var messages []model.Messages
	for rows.Next() {
		var sender, content, avatar, image, proyecto_id string
		var user_id int
		var createdAt string
		if err := rows.Scan(&sender, &user_id, &avatar, &proyecto_id, &content, &image, &createdAt); err != nil {
			log.Printf("Error scanning message: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning message from database"})
		}

		// Convertir createdAt a time.Time
		createdAtTime, err := time.Parse("2006-01-02 15:04:05", createdAt)
		if err != nil {
			log.Printf("Error parsing created_at: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error parsing created_at"})
		}

		msg := model.Messages{
			Sender:    sender,
			UserID:    user_id,
			Avatar:    avatar,
			RoomID:    proyecto_id,
			Content:   content,
			Image:     image,
			CreatedAt: createdAtTime,
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error after scanning messages"})
	}

	return c.JSON(messages)
}

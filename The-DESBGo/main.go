package main

import (
	"log"
	"principal/database"
	"principal/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

// Función init se ejecuta al iniciar el programa.
func init() {
	// Cargar las variables de entorno desde el archivo .env.
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No se pudo cargar el archivo .env")
	}

}

func main() {
	// Conectar a la base de datos.
	database.ConnectDB()

	// Obtener el objeto de base de datos SQL subyacente para configuraciones avanzadas.
	sqlDB, err := database.DBConn.DB()
	if err != nil {
		log.Println("Error al obtener el objeto de base de datos SQL:", err)
	}
	// Asegurar que la base de datos se cierre al finalizar el programa.
	defer sqlDB.Close()
	// Crear una nueva instancia de la aplicación Fiber.

	app := fiber.New(fiber.Config{
		BodyLimit: 500 * 1024 * 1024, // 100 MB
	})

	app.Static("/projects", "./projects")

	// Configurar middleware para permitir solicitudes CORS desde el frontend en localhost:3000.
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET, POST, PUT, DELETE",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization", // Permitir estos encabezados en las solicitudes.
	}))
	// Configurar middleware para registrar cada solicitud entrante.
	app.Use(logger.New())

	// Configurar las rutas de la aplicación utilizando el enrutador definido en el paquete 'router'.
	router.StupRoutes(app)

	// Iniciar el servidor en el puerto 4000.

	app.Listen(":4000")
}

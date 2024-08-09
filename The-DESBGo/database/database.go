package database

import (
	"log"
	"os"

	"principal/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DBConn *gorm.DB // Variable global para almacenar la conexión a la base de datos

// ConnectDB establece la conexión a la base de datos MySQL
func ConnectDB() {
	// Obtener credenciales de la base de datos desde variables de entorno
	user := os.Getenv("db_user")
	password := os.Getenv("db_password")
	dbname := os.Getenv("db_name")

	// Construir cadena de conexión DSN (Data Source Name)
	dsn := user + ":" + password + "@tcp(localhost:3306)/" + dbname +
		"?charset=utf8mb4&parseTime=True&loc=Local"

	// Establecer conexión a la base de datos MySQL
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error), // Configurar el nivel de registro de errores de GORM
	})

	if err != nil {
		log.Println("Error al conectar a la base de datos:", err) // Registro de error si la conexión falla
	}

	log.Println("Conexion exitosa") // Registro de que la conexión se ha establecido con éxito

	// Migrar automáticamente el modelo 'User' a la base de datos
	db.AutoMigrate(new(model.User))
	db.AutoMigrate(new(model.PasswordRecover))
	db.AutoMigrate(new(model.Producto))
	db.AutoMigrate(new(model.IfcFile))
	db.AutoMigrate(new(model.Incidencia))
	db.AutoMigrate(new(model.Tarea))

	// Asignar la conexión a la variable global 'DBConn' para su uso posterior
	DBConn = db
}

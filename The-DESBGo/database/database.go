package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB // Variable global para almacenar la conexión a la base de datos

// ConnectDB establece la conexión a la base de datos MySQL
func ConnectDB() {
	var err error
	DB, err = sql.Open("mysql", "root:@tcp(localhost:3306)/the_desb")
	if err != nil {
		log.Fatal(err)
	}

	// Verificar la conexión a la base de datos
	err = DB.Ping()
	if err != nil {
		log.Fatal(err)
	}
}

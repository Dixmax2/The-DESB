package controller

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"principal/database"
	"principal/model"
	"strconv"
	"strings"
	s "strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

func AddProduct(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del producto
	name := c.FormValue("name")
	descripcion := c.FormValue("descripcion")
	precio := c.FormValue("precio")
	tipo := c.FormValue("tipo")
	cantidad := c.FormValue("cantidad")

	// Manejo del archivo de imagen
	imageFile, err := c.FormFile("imageFile")

	// Nombre de la miniatura (con valor por defecto)
	miniatura := "DNI.png" // Aquí asignas la imagen por defecto

	if err == nil {
		// Si se subió un archivo, procesar la imagen
		splitFileName := strings.Split(imageFile.Filename, ".")
		extensionImg := splitFileName[len(splitFileName)-1]

		// Verificar la extensión de la imagen
		if extensionImg != "png" && extensionImg != "jpg" && extensionImg != "jpeg" {
			return c.JSON(fiber.Map{"error": "Formato de la imagen no permitido"})
		}

		// Asignar el nombre correcto para la miniatura
		miniatura = "miniatura." + extensionImg
	}

	// Creación de un nuevo producto con los datos proporcionados
	producto := model.Producto{
		Name:          name,
		Descripcion:   descripcion,
		Precio:        precio,
		Tipo:          tipo,
		Cantidad:      cantidad,
		Miniatura:     miniatura,
		FechaCreacion: time.Now().Format("02/01/2006"),
	}

	// Comprobar si el producto ya existe en la base de datos
	var count int
	err = database.DB.QueryRow("SELECT COUNT(*) FROM productos WHERE name = ?", name).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		// Si el nombre ya está en uso, devolver un error
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "El producto ya existe"})
	}

	// Creación del producto en la base de datos
	_, err = database.DB.Exec("INSERT INTO productos (name, descripcion, precio, tipo, cantidad, miniatura, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
		name, descripcion, precio, tipo, cantidad, miniatura, time.Now().Format("02/01/2006"))
	if err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear el producto"})
	}

	// Consultar el producto recién creado para obtener su ID
	err = database.DB.QueryRow("SELECT id FROM productos WHERE name = ?", name).Scan(&producto.ID)
	if err != nil {
		return err
	}

	// Construcción del path del producto usando el ID
	projectPath := "./projects/" + strconv.FormatUint(uint64(producto.ID), 10)
	fmt.Println(projectPath)

	// Verificar si la carpeta del producto ya existe
	if _, err := os.Stat(projectPath); !os.IsNotExist(err) {
		_, err = database.DB.Exec("DELETE FROM productos WHERE name = ?", name)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{"error": "El producto ya existe"})
	}

	// Crear la carpeta del producto y sus subcarpetas
	if err := os.MkdirAll(projectPath, 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(projectPath+"/images", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(projectPath+"/ifc", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(projectPath+"/pdf", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(projectPath+"/dwg", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}

	// Si se subió una imagen, guardarla en la carpeta del producto
	if imageFile != nil {
		filePathImg := filepath.Join(projectPath, miniatura)
		if err := c.SaveFile(imageFile, filePathImg); err != nil {
			_, err = database.DB.Exec("DELETE FROM productos WHERE name = ?", name)
			if err != nil {
				return err
			}
			os.RemoveAll(projectPath) // Limpieza si falla la creación del archivo
			return c.JSON(fiber.Map{"error": "No se pudo guardar el archivo"})
		}
	}

	return c.JSON(producto)
}

func GetProjects(c *fiber.Ctx) error {
	// Consultar productos no archivados
	rowsProyectos, err := database.DB.Query("SELECT * FROM productos WHERE archivado = false")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer rowsProyectos.Close()

	var productos []model.Producto

	// Iterar sobre los productos no archivados
	for rowsProyectos.Next() {
		var producto model.Producto
		if err := rowsProyectos.Scan(
			&producto.ID,
			&producto.Name,
			&producto.Descripcion,
			&producto.FechaCreacion,
			&producto.Precio,
			&producto.Tipo,
			&producto.Cantidad,
			&producto.Miniatura,
			&producto.Archivado,
			&producto.FechaExpiracion,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Consultar el número de usuarios asignados al producto
		var countUsuarios int
		if err := database.DB.QueryRow("SELECT COUNT(*) FROM project_assignments WHERE producto_id = ?", producto.ID).Scan(&countUsuarios); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		if countUsuarios > 0 {
			// Consultar usuarios asignados al producto
			rowsUsuarios, err := database.DB.Query("SELECT u.id, u.name, u.email, u.role FROM users u JOIN project_assignments pa ON u.id = pa.user_id WHERE pa.proyecto_id = ?", producto.ID)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			defer rowsUsuarios.Close()

			// Iterar sobre los usuarios y agregarlos al producto
			var usuarios []model.User
			for rowsUsuarios.Next() {
				var usuario model.User
				if err := rowsUsuarios.Scan(
					&usuario.ID,
					&usuario.Name,
					&usuario.Email,
					&usuario.Role,
					// Agregar más campos según la estructura de la tabla users
				); err != nil {
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
				}
				usuarios = append(usuarios, usuario)
			}
			producto.Users = usuarios
		}

		// Agregar el producto al slice de productos
		productos = append(productos, producto)
	}
	if err := rowsProyectos.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Respuesta JSON con todos los productos y sus datos relacionados
	return c.JSON(productos)
}

func EditProject(c *fiber.Ctx) error {
	// Obtener el ID del producto a editar
	id := c.FormValue("id")

	// Buscar el producto en la base de datos por su ID
	var producto model.Producto
	err := database.DB.QueryRow("SELECT id, name, descripcion, lantitud, longitud, miniatura FROM productos WHERE id = ?", id).Scan(
		&producto.ID,
		&producto.Name,
		&producto.Descripcion,
		&producto.Precio,
		&producto.Tipo,
		&producto.Cantidad,
		&producto.Miniatura,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al buscar producto"})
	}

	// Actualizar los datos del producto con los nuevos datos proporcionados
	producto.Name = c.FormValue("name")
	producto.Descripcion = c.FormValue("descripcion")
	producto.Precio = c.FormValue("precio")
	producto.Tipo = c.FormValue("tipo")
	producto.Cantidad = c.FormValue("cantidad")

	// Manejo del archivo de miniatura si se proporciona
	imageFile, err := c.FormFile("imageFile")

	if err == nil {
		// Verificar la extensión de la imagen
		splitFileName := s.Split(imageFile.Filename, ".")
		extensionImg := splitFileName[len(splitFileName)-1]

		if extensionImg != "png" && extensionImg != "jpg" && extensionImg != "jpeg" {
			return c.JSON(fiber.Map{"error": "Formato de la imagen no permitido"})
		}

		// Construcción del path del producto usando el ID
		projectPath := "./projects/" + strconv.FormatUint(uint64(producto.ID), 10)
		imagePath := filepath.Join(projectPath, "miniatura."+extensionImg)

		// Eliminar el archivo de miniatura anterior si existe
		if producto.Miniatura != "" {
			oldImagePath := filepath.Join(projectPath, producto.Miniatura)
			if _, err := os.Stat(oldImagePath); err == nil {
				if err := os.Remove(oldImagePath); err != nil {
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No se pudo eliminar el archivo de miniatura anterior"})
				}
			}
		}

		// Guardar el archivo de imagen en la carpeta del producto
		if err := c.SaveFile(imageFile, imagePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No se pudo guardar el archivo de miniatura"})
		}

		// Actualizar el campo de miniatura en la estructura del producto
		producto.Miniatura = "miniatura." + extensionImg
	}
	if err != nil {
		// Guardar los cambios en la base de datos sin modificar la miniatura
		_, err = database.DB.Exec("UPDATE productos SET name = ?, descripcion = ?, lantitud = ?, longitud = ? WHERE id = ?",
			producto.Name,
			producto.Descripcion,
			producto.Precio,
			producto.Tipo,
			producto.Cantidad,
			producto.ID,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No se pudieron guardar los cambios"})
		}

		// Respuesta JSON con los datos del producto editado
		return c.JSON(producto)
	}

	// Guardar los cambios en la base de datos
	_, err = database.DB.Exec("UPDATE productos SET name = ?, descripcion = ?, lantitud = ?, longitud = ?, miniatura = ? WHERE id = ?",
		producto.Name,
		producto.Descripcion,
		producto.Precio,
		producto.Tipo,
		producto.Cantidad,
		producto.Miniatura,
		producto.ID,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No se pudieron guardar los cambios"})
	}

	// Respuesta JSON con los datos del producto editado
	return c.JSON(producto)
}

func GetProjectByUser(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del usuario
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Error procesando datos"})
	}

	fmt.Println(data)

	// Obtener el ID del usuario
	userID := data["userID"]

	// Buscar los productos asignados al usuario en la base de datos
	rowsProyectos, err := database.DB.Query("SELECT p.id, p.name, p.descripcion, p.fechaCreacion, p.lantitud, p.longitud, p.miniatura, p.archivado, p.fechaExpiracion FROM productos p JOIN project_assignments pa ON p.id = pa.proyecto_id WHERE pa.user_id = ? AND p.archivado = false", userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer rowsProyectos.Close()

	var productos []model.Producto

	// Iterar sobre los productos asignados al usuario
	for rowsProyectos.Next() {
		var producto model.Producto
		if err := rowsProyectos.Scan(
			&producto.ID,
			&producto.Name,
			&producto.Descripcion,
			&producto.FechaCreacion,
			&producto.Precio,
			&producto.Tipo,
			&producto.Cantidad,
			&producto.Miniatura,
			&producto.Archivado,
			&producto.FechaExpiracion,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Consultar el número de archivos Ifc asociados al producto
		var countIfcFiles int
		if err := database.DB.QueryRow("SELECT COUNT(*) FROM ifc_files WHERE project_id = ?", producto.ID).Scan(&countIfcFiles); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Consultar el número de usuarios asignados al producto
		var countUsuarios int
		if err := database.DB.QueryRow("SELECT COUNT(*) FROM project_assignments WHERE proyecto_id = ?", producto.ID).Scan(&countUsuarios); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		if countUsuarios > 0 {
			// Consultar usuarios asignados al producto
			rowsUsuarios, err := database.DB.Query("SELECT u.id, u.name, u.email, u.role FROM users u JOIN project_assignments pa ON u.id = pa.user_id WHERE pa.proyecto_id = ?", producto.ID)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			defer rowsUsuarios.Close()

			// Iterar sobre los usuarios y agregarlos al producto
			var usuarios []model.User
			for rowsUsuarios.Next() {
				var usuario model.User
				if err := rowsUsuarios.Scan(
					&usuario.ID,
					&usuario.Name,
					&usuario.Email,
					&usuario.Role,
				); err != nil {
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
				}
				usuarios = append(usuarios, usuario)
			}
			producto.Users = usuarios
		}

		// Agregar el producto al slice de productos
		productos = append(productos, producto)
	}
	if err := rowsProyectos.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Respuesta JSON con todos los productos y sus datos relacionados
	return c.JSON(productos)
}

func AssignUsersToProject(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del usuario y el producto
	var data struct {
		UserID    []string `json:"userID"`
		ProjectID string   `json:"projectID"`
	}

	err := c.BodyParser(&data)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Validar que se haya proporcionado una lista de usuarios y un ID de producto
	if len(data.UserID) == 0 || data.ProjectID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Se requieren IDs de usuarios y ID del producto"})
	}

	// Verificar que el producto exista
	var projectExists bool
	err = database.DB.QueryRow("SELECT EXISTS (SELECT 1 FROM productos WHERE id = ?)", data.ProjectID).Scan(&projectExists)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if !projectExists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Preparar la consulta de inserción
	query := "INSERT INTO project_assignments (proyecto_id, user_id) VALUES (?, ?)"
	stmt, err := database.DB.Prepare(query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer stmt.Close()

	// Iterar sobre la lista de usuarios y asignarlos al producto
	for _, userID := range data.UserID {
		// Verificar que el usuario exista
		var userExists bool
		err = database.DB.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE id = ?)", userID).Scan(&userExists)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		if !userExists {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Usuario no encontrado: " + userID})
		}

		// Insertar la asignación en la base de datos
		_, err := stmt.Exec(data.ProjectID, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "Usuarios asignados al producto correctamente"})
}

func ArchivarProyecto(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto
	projectID := data["projectID"]

	// Comprobar si el producto existe
	var archivado bool
	err = database.DB.QueryRow("SELECT archivado FROM productos WHERE id = ?", projectID).Scan(&archivado)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if archivado {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "producto ya archivado", "id": projectID})
	}

	// Calcular la fecha de expiración
	fechaExpiracion := time.Now().AddDate(1, 0, 0).Format("02/01/2006")

	// Cambiar el estado del producto a archivado y actualizar la fecha de expiración
	_, err = database.DB.Exec("UPDATE productos SET archivado = true, fechaExpiracion = ? WHERE id = ?", fechaExpiracion, projectID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{
		"message": "producto archivado correctamente",
	})
}

// comprobar que la fecha de expiración de los productos archivados ha llegado y eliminarlos
func ComprobarProyectosArchivados(c *fiber.Ctx) error {
	// Consultar todos los productos archivados
	rows, err := database.DB.Query("SELECT id, fechaExpiracion FROM productos WHERE archivado = ?", true)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer rows.Close()

	// Iterar sobre los resultados
	for rows.Next() {
		var producto model.Producto
		if err := rows.Scan(
			&producto.ID,
			&producto.FechaExpiracion,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Convertir la fecha de expiración del producto a un objeto de tiempo
		fechaExpiracion, err := time.Parse("02/01/2006", producto.FechaExpiracion)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Comprobar si la fecha de expiración ha llegado
		if time.Now().After(fechaExpiracion) {
			// Eliminar el producto y sus archivos asociados
			_, err := database.DB.Exec("DELETE FROM productos WHERE id = ?", producto.ID)
			if err != nil {
				c.Status(fiber.StatusConflict)
				return c.JSON(fiber.Map{"msg": "error"})
			}

			// Eliminar la carpeta del producto
			projectPath := "./projects/" + strconv.FormatUint(uint64(producto.ID), 10)
			if err := os.RemoveAll(projectPath); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
		}
	}
	if err := rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "productos archivados comprobados"})
}

func DesarchivarProyecto(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto
	projectID := data["projectID"]

	// Verificar si el producto existe
	fmt.Println(projectID)
	var count int
	err = database.DB.QueryRow("SELECT COUNT(*) FROM productos WHERE id = ?", projectID).Scan(&count)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	fmt.Println(projectID)
	if count == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Cambiar el estado del producto a no archivado y eliminar la fecha de expiración
	_, err = database.DB.Exec("UPDATE productos SET archivado = ?, fechaExpiracion = ? WHERE id = ?", false, "", projectID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "producto desarchivado correctamente"})
}

// // Función para subir el PDF
// func UploadPDF(c *fiber.Ctx) error {
// 	// Parse the multipart form containing the file
// 	file, err := c.FormFile("file")
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse form"})
// 	}

// 	// Crear la carpeta del producto y sus subcarpetas
// 	if err := os.MkdirAll("uploads", 0755); err != nil {
// 		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
// 	}

// 	// Define the path to save the file
// 	filePath := "./uploads/a.pdf"

// 	// Save the file to the defined path
// 	if err := c.SaveFile(file, filePath); err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
// 	}

// 	// Respond with a success message
// 	return c.JSON(fiber.Map{"message": "File uploaded successfully", "filePath": filePath})
// }

// // Función para obtener el PDF
// func GetPDF(c *fiber.Ctx) error {
// 	// Define the path to the PDF file (for demonstration purposes, using a static file path)
// 	filePath := "./uploads/a.pdf"

// 	// Open the file
// 	file, err := os.Open(filePath)
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open file"})
// 	}
// 	defer file.Close()

// 	// Set the content type and serve the file
// 	c.Set("Content-Type", "application/pdf")
// 	return c.SendStream(file)
// }

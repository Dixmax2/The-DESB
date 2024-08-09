package controller

import (
	"fmt"
	"os"
	"path/filepath"
	"principal/database"
	"principal/model"
	"strconv"
	s "strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

func AddProject(c *fiber.Ctx) error {
	name := c.FormValue("name")
	descripcion := c.FormValue("descripcion")
	precio := c.FormValue("precio")

	// Manejo del archivo de imagen
	imageFile, err := c.FormFile("imageFile")
	if err != nil {
		return c.JSON(fiber.Map{"error": "Problema obteniendo el archivo de imagen"})
	}

	// Verificar la extensión de la imagen
	splitFileName := s.Split(imageFile.Filename, ".")
	extensionImg := splitFileName[len(splitFileName)-1]

	// Creación de un nuevo producto con los datos proporcionados
	producto := model.Producto{
		Name:          name,
		Descripcion:   descripcion,
		Precio:        precio,
		Miniatura:     "miniatura." + extensionImg,
		FechaCreacion: time.Now().Format("02/01/2006"),
	}

	// Creación del producto en la base de datos
	if result := database.DBConn.Create(&producto); result.Error != nil {
		return c.JSON(fiber.Map{"error crear producto": result.Error.Error()})
	}

	if result := database.DBConn.Where("name = ?", name).Last(&producto); result.Error != nil {
		return c.JSON(fiber.Map{"producto no existe": result.Error.Error()})
	}

	// Construcción del path del producto usando el ID
	productPath := "./product/" + strconv.FormatUint(uint64(producto.ID), 10)

	// Verificar si la carpeta del producto ya existe
	if _, err := os.Stat(productPath); !os.IsNotExist(err) {
		database.DBConn.Delete(&producto)
		return c.JSON(fiber.Map{"error": "producto ya existe"})
	}

	// Crear la carpeta del producto y sus subcarpetas
	if err := os.MkdirAll(productPath, 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(productPath+"/images", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(productPath+"/ifc", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(productPath+"/pdf", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}
	if err := os.MkdirAll(productPath+"/dwg", 0755); err != nil {
		return c.JSON(fiber.Map{"error": "No se pudo crear la carpeta"})
	}

	fmt.Println(imageFile.Filename)

	// Verificar la extensión de la imagen
	if extensionImg != "png" && extensionImg != "jpg" && extensionImg != "jpeg" {
		database.DBConn.Delete(&producto)
		os.RemoveAll(productPath)
		return c.JSON(fiber.Map{"error": "Formato de la imagen no permitido"})
	}

	// Guardar el archivo de imagen en la carpeta del producto
	filePathImg := filepath.Join(productPath, "miniatura."+extensionImg)
	if err := c.SaveFile(imageFile, filePathImg); err != nil {
		database.DBConn.Delete(&producto)
		os.RemoveAll(productPath) // Limpieza si falla la creación del archivo
		return c.JSON(fiber.Map{"error": "No se pudo guardar el archivo"})
	}

	// Procesar múltiples archivos IFC
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error procesando archivos form"})
	}

	ifcFiles := form.File["ifcFiles"]
	// if err != nil {
	// 	database.DBConn.Delete(&producto)
	// 	os.RemoveAll(productPath )
	// 	return c.JSON(fiber.Map{"error": "Problema obteniendo el archivo IFC"})
	// }

	// // Verificar la extensión del archivo IFC
	// splitFileName = s.Split(ifcFile.Filename, ".")
	// extensionIfc := splitFileName[len(splitFileName)-1]
	// if extensionIfc != "ifc" {
	// 	database.DBConn.Delete(&producto)
	// 	os.RemoveAll(productPath )
	// 	return c.JSON(fiber.Map{"error": "Formato del archivo IFC no permitido"})
	// }

	for _, ifcFile := range ifcFiles {
		splitFileName := s.Split(ifcFile.Filename, ".")
		extension := splitFileName[len(splitFileName)-1]
		if extension != "ifc" {
			return c.JSON(fiber.Map{"error": "Formato del archivo IFC no permitido"})
		}

		filePath := filepath.Join(productPath, "ifc", ifcFile.Filename)
		if err := c.SaveFile(ifcFile, filePath); err != nil {
			database.DBConn.Delete(&producto)
			os.RemoveAll(productPath) // Limpieza si falla la creación del archivo
			return c.JSON(fiber.Map{"error": "No se pudo guardar el archivo", "details": err.Error()})
		}
	}

	// // Guardar el archivo IFC en la carpeta del producto
	// filePathIfc := filepath.Join(productPath , "ifc", ifcFile.Filename)
	// if err := c.SaveFile(ifcFile, filePathIfc); err != nil {
	// 	database.DBConn.Delete(&producto)
	// 	os.RemoveAll(productPath ) // Limpieza si falla la creación del archivo
	// 	return c.JSON(fiber.Map{"error": "No se pudo guardar el archivo", "details": err.Error()})
	// }

	return c.JSON(producto)
}

func Getproduct(c *fiber.Ctx) error {
	// Obtener todos los productos de la base de datos
	var productos []model.Producto

	result := database.DBConn.Preload("Users").Preload("IfcFiles").Where("archivado = ?", false).Find(&productos)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "productos no encontrados"})
	}

	// Respuesta JSON con todos los productos
	return c.JSON(productos)
}

func EditProject(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto a editar
	id := data["id"]

	// Buscar el producto en la base de datos por su ID
	var producto model.Producto
	result := database.DBConn.First(&producto, id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Actualizar los datos del producto con los nuevos datos proporcionados
	producto.Name = data["name"]
	producto.Descripcion = data["descripcion"]
	producto.Precio = data["precio"]

	// Guardar los cambios en la base de datos
	database.DBConn.Save(&producto)

	// Respuesta JSON con los datos del producto editado
	return c.JSON(producto)
}

func GetProjectByUser(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del usuario
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del usuario
	userID := data["userID"]

	// Buscar el usuario con sus productos
	var user model.User
	result := database.DBConn.Preload("product").First(&user, userID)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Usuario no encontrado"})
	}

	// Devolver los productos del usuario
	return c.JSON(user.Productos)
}

func AssignUserToProject(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del usuario y el producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del usuario y el producto
	userID := data["userID"]
	projectID := data["projectID"]

	// Buscar el usuario y el producto en la base de datos por sus IDs
	var user model.User
	database.DBConn.First(&user, userID)

	var producto model.Producto
	database.DBConn.First(&producto, projectID)

	// Asignar al usuario el producto
	err = database.DBConn.Model(&user).Association("product").Append(&producto)
	if err != nil {
		return c.JSON(fiber.Map{"message": "Error en la asignación del producto al usuario"})
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "Usuario asignado al producto correctamente"})
}

func AddIfcFileToProject(c *fiber.Ctx) error {
	//Estructura para almacenar los datos del archivo IFC
	//Se obtienen los datos del cuerpo de la solicitud
	var data struct {
		ProjectID uint     `json:"projectId"`
		IfcURLs   []string `json:"ifcUrls"`
	}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Iniciar una transacción de la base de datos
	// una transacción es una sesión de trabajo con la base de datos que se realiza bajo un conjunto de operaciones que,
	// o bien se completan todas como un todo , o no se realiza ninguna
	tx := database.DBConn.Begin()
	if tx.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": tx.Error.Error()})
	}

	var count int64 //Variable integer
	//Se cuenta el número de archivos IFC existentes para el producto especificado
	tx.Model(&model.IfcFile{}).Where("project_id = ?", data.ProjectID).Count(&count)

	isFirstLoad := count == 0 // True si es el primer archivo IFC cargado para el producto

	// Procesar cada URL de IFC
	for _, url := range data.IfcURLs {
		newIfcFile := model.IfcFile{
			ProjectID:   data.ProjectID,
			IfcURL:      url,
			IsFirstLoad: isFirstLoad,
		}

		// Crear un nuevo archivo IFC en la base de datos
		if err := tx.Create(&newIfcFile).Error; err != nil {
			tx.Rollback() // En caso de error, deshacer la transacción y devolver un error
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Solo el primer archivo es marcado como carga inicial
		isFirstLoad = false
	}

	// Confirmar la transacción
	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "IFC files añadidos correctamente"})
}

func AddIncidencia(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos de la incidencia
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// comprobar si el producto existe
	var producto model.Producto
	result := database.DBConn.First(&producto, data["projectID"])
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Creación de una nueva incidencia con los datos proporcionados
	incidencia := model.Incidencia{
		Name:          data["name"],
		Descripcion:   data["descripcion"],
		FechaCreacion: time.Now().Format("02/01/2006"),
		Prioridad:     data["prioridad"],
		UrlImage:      data["urlImage"],
		ProyectoID:    data["ProyectoID"],
		Users:         data["users"],
		Estado:        data["estado"],
	}

	// Creación de la incidencia en la base de datos
	database.DBConn.Create(&incidencia)

	// Respuesta JSON con los datos de la incidencia creada
	return c.JSON(incidencia)
}

func GetIncidenciasByProjectId(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto
	projectID := data["projectID"]

	// comprobar si el producto existe
	var producto model.Producto
	result := database.DBConn.First(&producto, projectID)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Buscar las incidencias del producto en la base de datos
	var incidencias []model.Incidencia
	result = database.DBConn.Where("producto_id = ?", projectID).Find(&incidencias)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Incidencias no encontradas"})
	}

	// Respuesta JSON con las incidencias del producto
	return c.JSON(incidencias)
}

func GetIncidencias(c *fiber.Ctx) error {
	// Obtener todas las incidencias de la base de datos
	var incidencia []model.Incidencia

	result := database.DBConn.Find(&incidencia)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Incidencias no encontradas"})
	}

	return c.JSON(incidencia)
}

func AddTarea(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos de la incidencia
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// comprobar si el producto existe
	var producto model.Producto
	result := database.DBConn.First(&producto, data["projectID"])
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Creación de una nueva incidencia con los datos proporcionados
	tarea := model.Tarea{
		Name:          data["name"],
		Descripcion:   data["descripcion"],
		FechaCreacion: time.Now().Format("02/01/2006"),
		Prioridad:     data["prioridad"],
		FechaLimite:   data["fechaLimite"],
		Tipo:          data["tipo"],
		UrlTarea:      data["urlTarea"],
		ProyectoID:    data["projectID"],
		Users:         data["users"],
		Estado:        data["estado"],
	}

	// Creación de la incidencia en la base de datos
	database.DBConn.Create(&tarea)

	// Respuesta JSON con los datos de la incidencia creada
	return c.JSON(tarea)
}

func GetTareasByProjectId(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto
	projectID := data["projectID"]

	// comprobar si el producto existe
	var producto model.Producto
	result := database.DBConn.First(&producto, projectID)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Buscar las incidencias del producto en la base de datos
	var tares []model.Tarea
	result = database.DBConn.Where("producto_id = ?", projectID).Find(&tares)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Incidencias no encontradas"})
	}

	// Respuesta JSON con las incidencias del producto
	return c.JSON(tares)
}

func GetTareas(c *fiber.Ctx) error {
	var tarea []model.Tarea

	result := database.DBConn.Find(&tarea)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tareas no encontradas"})
	}

	return c.JSON(tarea)
}

func Archivarproducto(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto
	projectID := data["projectID"]

	// comprobar si el producto existe
	var producto model.Producto
	result := database.DBConn.First(&producto, projectID)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Cambiar el estado del producto a archivado
	producto.Archivado = true

	// Añadir la fecha de expiración al producto 1 año después de la fecha de creación
	producto.FechaExpiracion = time.Now().AddDate(1, 0, 0).Format("02/01/2006")

	// Guardar los cambios en la base de datos
	database.DBConn.Save(&producto)

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "producto archivado correctamente"})
}

func GetproductosArchivados(c *fiber.Ctx) error {
	// Obtener todos los productos archivados
	var productos []model.Producto
	result := database.DBConn.Where("archivado = ?", true).Find(&productos)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "productos no encontrados"})
	}

	// Respuesta JSON con los productos archivados
	return c.JSON(productos)
}

// comprobar que la fecha de expiración de los productos archivados ha llegado y eliminarlos
func ComprobarproductosArchivados(c *fiber.Ctx) error {
	// Obtener todos los productos archivados
	var productos []model.Producto
	result := database.DBConn.Where("archivado = ?", true).Find(&productos)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "productos no encontrados"})
	}

	// Iterar sobre los productos archivados
	for _, producto := range productos {
		// Convertir la fecha de expiración del producto a un objeto de tiempo
		fechaExpiracion, err := time.Parse("02/01/2006", producto.FechaExpiracion)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Comprobar si la fecha de expiración ha llegado
		if time.Now().After(fechaExpiracion) {
			// Eliminar el producto y sus archivos asociados
			database.DBConn.Delete(&producto)
			productPath := "./product/" + strconv.FormatUint(uint64(producto.ID), 10)
			os.RemoveAll(productPath)
		}
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "productos archivados comprobados"})
}

func Desarchivarproducto(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener el ID del producto
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Obtener el ID del producto
	projectID := data["projectID"]

	// comprobar si el producto existe
	var producto model.Producto
	result := database.DBConn.First(&producto, projectID)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "producto no encontrado"})
	}

	// Cambiar el estado del producto a no archivado
	producto.Archivado = false

	// Guardar los cambios en la base de datos
	database.DBConn.Save(&producto)

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(fiber.Map{"message": "producto desarchivado correctamente"})
}

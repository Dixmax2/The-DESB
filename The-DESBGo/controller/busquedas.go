package controller

import (
	"principal/database"

	"github.com/gofiber/fiber/v2"
)

// SearchProducts maneja la búsqueda de productos por nombre.
func SearchProducts(c *fiber.Ctx) error {
	query := c.Query("query")
	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "El término de búsqueda no puede estar vacío",
		})
	}

	// Utiliza la conexión global a la base de datos
	db := database.DB

	// Ejecutar la consulta
	rows, err := db.Query("SELECT id, name, descripcion, fechaCreacion, precio, tipo, cantidad, miniatura, archivado, fechaExpiracion FROM productos WHERE LOWER(name) LIKE ?", "%"+query+"%")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error al realizar la búsqueda",
		})
	}
	defer rows.Close()

	// Procesar los resultados
	var productos []map[string]interface{}
	for rows.Next() {
		var id uint
		var name, descripcion, fechaCreacion, precio, tipo, cantidad, miniatura, fechaExpiracion string
		var archivado bool

		if err := rows.Scan(
			&id,
			&name,
			&descripcion,
			&fechaCreacion,
			&precio,
			&tipo,
			&cantidad,
			&miniatura,
			&archivado,
			&fechaExpiracion,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error al procesar los resultados",
			})
		}

		producto := map[string]interface{}{
			"id":              id,
			"name":            name,
			"descripcion":     descripcion,
			"fechaCreacion":   fechaCreacion,
			"precio":          precio,
			"tipo":            tipo,
			"cantidad":        cantidad,
			"miniatura":       miniatura,
			"archivado":       archivado,
			"fechaExpiracion": fechaExpiracion,
		}

		productos = append(productos, producto)
	}

	return c.JSON(productos)
}

package router

import (
	"principal/controller"

	"github.com/gofiber/fiber/v2"
)

func StupRoutes(app *fiber.App) {

	app.Post("/login", controller.ControlLogin)
	app.Post("/register", controller.ControlRegister)
	app.Post("/logout", controller.ControlLogout)
	app.Post("/password-recover", controller.PasswordRecover)
	app.Post("/password-recover-confirm", controller.PasswordReset)
	app.Get("/get-users", controller.GetUsers)
	app.Get("/user-check", controller.UserCheck)

	app.Post("/add-project", controller.AddProject)
	app.Get("/get-projects", controller.Getproduct)
	app.Put("/edit-project", controller.EditProject)
	app.Post("/assign-user-to-project", controller.AssignUserToProject)
	app.Get("/get-project-by-user", controller.GetProjectByUser)

	app.Post("/add-incidencia", controller.AddIncidencia)
	app.Get("/get-incidencia-by-project", controller.GetIncidenciasByProjectId)
	app.Get("/get-incidencias", controller.GetIncidencias)

	app.Post("/add-tarea", controller.AddTarea)
	app.Get("/get-tareas", controller.GetTareas)
	app.Get("/get-tareas-by-project", controller.GetTareasByProjectId)

	app.Post("/archivar-proyecto", controller.Archivarproducto)
	app.Get("/get-archived-projects", controller.GetproductosArchivados)
	app.Post("/comprobar-archived-projects", controller.ComprobarproductosArchivados)

}

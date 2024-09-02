package router

import (
	"principal/controller"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func StupRoutes(app *fiber.App) {

	app.Post("/login", controller.ControlLogin)
	app.Post("/register", controller.ControlRegister)
	app.Post("/logout", controller.ControlLogout)
	app.Post("/password-recover", controller.PasswordRecover)
	app.Post("/password-recover-confirm", controller.PasswordReset)
	app.Get("/get-users", controller.GetUsers)
	app.Get("/user-check", controller.UserCheck)
	app.Post("/actualizar-nombre", controller.ActualizarNombre)
	app.Post("/cambiar-contrasena", controller.CambiarContrasena)
	app.Post("/dar-admin", controller.DarAdmin)
	app.Post("/quitar-admin", controller.QuitarAdmin)
	app.Post("/invitar-usuario", controller.InvitarUsuario)
	app.Post("/registrar-usuario-invitado", controller.RegistrarUsuarioInvitado)

	app.Post("/add-product", controller.AddProduct)
	app.Get("/get-productos", controller.GetProjects)
	app.Get("/get-productos/:id", controller.GetProductByID)
	app.Put("/edit-project", controller.EditProject)
	app.Delete("/delete-product/:id", controller.DeleteProject)

	//app.Post("/assign-user-to-project", controller.AssignUserToProject)
	app.Get("/get-project-by-user", controller.GetProjectByUser)

	app.Get("/search-products", controller.SearchProducts)

	app.Get("/ws", websocket.New(controller.HandleConnections))
	app.Post("/getMessages", controller.GetMessages)

	/*app.Post("/add-incidencia", controller.AddIncidencia)
	app.Get("/get-incidencia-by-project", controller.GetIncidenciasByProjectId)
	app.Get("/get-incidencias", controller.GetIncidencias)*/

	/*app.Post("/add-tarea", controller.AddTarea)
	app.Get("/get-tareas", controller.GetTareas)
	app.Get("/get-tareas-by-project", controller.GetTareasByProjectId)*/

	/*app.Post("/archivar-proyecto", controller.Archivarproducto)
	app.Get("/get-archived-projects", controller.GetproductosArchivados)
	app.Post("/comprobar-archived-projects", controller.ComprobarproductosArchivados)*/

}

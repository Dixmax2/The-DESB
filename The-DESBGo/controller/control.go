package controller

import (
	"database/sql"
	"fmt"
	"math/rand"
	"net/smtp"
	"principal/database"
	"principal/model"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

func GetUsers(c *fiber.Ctx) error {
	var users []model.User

	// Preload Projects to include them in the fetched data
	rows, err := database.DB.Query("SELECT id, name, email, role, avatar FROM users")
	if err != nil {
		return err
	}
	defer rows.Close()

	// Next() sirve para iterar sobre las filas de la consulta
	for rows.Next() {
		var user model.User
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.Avatar)
		if err != nil {
			return err
		}
		users = append(users, user)
	}

	return c.JSON(users)
}

func ControlLogin(c *fiber.Ctx) error {
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Consultar el usuario desde la base de datos utilizando SQL
	var user model.User
	var createdAtStr string
	err = database.DB.QueryRow("SELECT id, name, email, password, role, avatar, created_at FROM users WHERE email = ?", data["email"]).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.Avatar,
		&createdAtStr,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.Status(400)
			return c.JSON(fiber.Map{"message": "Usuario no encontrado"})
		}
		return c.JSON(fiber.Map{"message": "Error al iniciar sesión", "error": err.Error()})
	}

	// Convertir la fecha y hora de creación a time.Time
	user.CreatedAt, err = time.Parse("2006-01-02 15:04:05", createdAtStr)
	if err != nil {
		return c.JSON(fiber.Map{"message": "Error al analizar la fecha de creación", "error": err.Error()})
	}

	// Verificación de la contraseña del usuario
	err = bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"]))
	if err != nil {
		c.Status(400)
		return c.JSON(fiber.Map{"message": "Contraseña incorrecta"})
	}

	// Creación del token JWT para la sesión del usuario
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})
	token, err := claims.SignedString([]byte(SecretKey))
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"message": "No pude entrar a la cuenta"})
	}

	// Configuración de una cookie HTTP para almacenar el token JWT
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	// Estructura temporal para devolver el usuario sin la contraseña
	userWithoutPassword := struct {
		ID    uint   `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
	}{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Role:  user.Role,
	}

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(userWithoutPassword)
}

// ControlRegister registra un nuevo usuario en la base de datos y devuelve una respuesta JSON.
func ControlRegister(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del usuario
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Verificar si el correo electrónico ya está en uso
	var count int
	err = database.DB.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", data["email"]).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		// Si el correo electrónico ya está en uso, devolver un error
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "El correo electrónico ya está en uso"})
	}

	// Generación del hash de la contraseña del usuario
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	// Creación del usuario en la base de datos
	stmt, err := database.DB.Prepare("INSERT INTO users(name, email, role, password, created_at) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	createdAt := time.Now()

	_, err = stmt.Exec(data["name"], data["email"], data["role"], password, createdAt)
	if err != nil {
		return err
	}

	// Creación del objeto de usuario con los datos proporcionados
	user := model.User{
		Name:      data["name"],
		Email:     data["email"],
		Role:      data["role"],
		CreatedAt: createdAt,
	}

	// Respuesta JSON con los datos del usuario creado
	return c.JSON(user)
}

func ControlLogout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"msg": "logout succes",
	})
}

func UserCheck(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	if cookie == "" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"msg": "coookie vacioo",
		})
	}

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"msg": "No autorizado",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user model.User
	var createdAtStr string

	err = database.DB.QueryRow("SELECT id, name, email, role, avatar, created_at FROM users WHERE id= ?", claims.Issuer).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.Avatar, &createdAtStr)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"msg": err.Error(),
		})
	}

	// Convertir la fecha y hora de creación a time.Time
	user.CreatedAt, err = time.Parse("2006-01-02 15:04:05", createdAtStr)
	if err != nil {
		return c.JSON(fiber.Map{"message": "Error al analizar la fecha de creación", "error": err.Error()})
	}

	return c.JSON(user)
}

func PasswordRecover(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	email := data["email"]

	err = database.DB.QueryRow("SELECT email FROM users WHERE email = ?", data["email"]).Scan(&email)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Usuario no encontrado",
			})
		}
		return err
	}

	token := RandString(16)

	// Preparar la declaración SQL para insertar el token de recuperación de contraseña en la base de datos
	stmt, err := database.DB.Prepare("INSERT INTO password_recovers (email, token) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Ejecutar la consulta SQL para insertar el token de recuperación de contraseña
	_, err = stmt.Exec(email, token)
	if err != nil {
		return err
	}

	from := "levitec@ifctransfer.com"
	to := []string{email}
	subject := "Recuperar contraseña"
	url := "http://localhost:3000/password-recover-confirm?token=" + token
	body := (`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
	  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta name="x-apple-disable-message-reformatting">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <title></title>

		<style type="text/css">
		  @media only screen and (min-width: 620px) {
	  .u-row {
		width: 600px !important;
	  }
	  .u-row .u-col {
		vertical-align: top;
	  }

	  .u-row .u-col-100 {
		width: 600px !important;
	  }

	}

	@media (max-width: 620px) {
	  .u-row-container {
		max-width: 100% !important;
		padding-left: 0px !important;
		padding-right: 0px !important;
	  }
	  .u-row .u-col {
		min-width: 320px !important;
		max-width: 100% !important;
		display: block !important;
	  }
	  .u-row {
		width: 100% !important;
	  }
	  .u-col {
		width: 100% !important;
	  }
	  .u-col > div {
		margin: 0 auto;
	  }
	}
	body {
	  margin: 0;
	  padding: 0;
	}

	table,
	tr,
	td {
	  vertical-align: top;
	  border-collapse: collapse;
	}

	p {
	  margin: 0;
	}

	.ie-container table,
	.mso-container table {
	  table-layout: fixed;
	}

	* {
	  line-height: inherit;
	}

	a[x-apple-data-detectors='true'] {
	  color: inherit !important;
	  text-decoration: none !important;
	}
	.button-33 {
	  background-color: #e44604;
	  border-radius: 100px;
	  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
	  color: green;
	  cursor: pointer;
	  display: inline-block;
	  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
	  padding: 7px 20px;
	  text-align: center;
	  text-decoration: none;
	  transition: all 250ms;
	  border: 0;
	  font-size: 16px;
	  user-select: none;
	  -webkit-user-select: none;
	  touch-action: manipulation;
	}

	.button-33:hover {
	  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
	  transform: scale(1.05) rotate(-1deg);
	}
	table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
		</style>

	<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

	</head>

	<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f0f0f0;color: #000000">
	  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f0f0f0;width:100%" cellpadding="0" cellspacing="0">
	  <tbody>
	  <tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="background-color: #ddffe7;height: 100%;width: 100% !important;">
	<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

	<table width="100%" cellpadding="0" cellspacing="0" border="0">
	  <tr>
		<td style="padding-right: 0px;padding-left: 0px;" align="center">
		  <img src= style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 300px;" width="50%">
		</td>
	  </tr>
	</table>

		  </td>
		</tr>
	  </tbody>
	</table>

	</div>
	  </div>
	</div>

		</div>
	  </div>
	  </div>

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

		<h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span>Se ha asignado un enlace para el cambio de contraseña.</span></span></span></h1>
		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

	  <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
		<p style="line-height: 140%;">Pulse aqui <strong>` + url + `</strong> para cambiar la contraseña <strong>` + url + `</strong>.</p>
		<p style="line-height: 140%; padding-bottom: 5%;"></p>
		<a style="text-decoration: none; color: #000000;" href="` + url + `"></a>
	  </div>

		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

		  </td>
		</tr>
	  </tbody>
	</table>

	</div>
	  </div>
	</div>
		</div>
	  </div>
	  </div>

	<div class="u-row-container" style="padding: 2px 0px 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

		<h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 400;"><span><span><span><span><span>Si tiene alguna duda o ha recibido este correo por error contacte con nosotros en info@dcrow.tech.<br />O entre en nuestra pagina <a href="https://levitec.ifctransfer.com/dashboard"<strong>Levitec IFC transfer</strong></a> para más información.</span></span></span></span></span></h1>

		  </td>
		</tr>
	  </tbody>
	</table>

	</div>
	  </div>
	</div>
		</div>
	  </div>
	  </div>

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 0px 0px;font-family:arial,helvetica,sans-serif;" align="left">

	  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #000000;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
		<tbody>
		  <tr style="vertical-align: top">
			<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
			  <span>&#160;</span>
			</td>
		  </tr>
		</tbody>
	  </table>

		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;" align="left">

	  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #000000;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
		<tbody>
		  <tr style="vertical-align: top">
			<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
			  <span>&#160;</span>
			</td>
		  </tr>
		</tbody>
	  </table>

		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 60px;font-family:arial,helvetica,sans-serif;" align="left">

		  </td>
		</tr>
	  </tbody>
	</table>

	  </div>
	</div>
		</div>
	  </div>
	  </div>
		</td>
	  </tr>
	  </tbody>
	  </table>
	</body>

	</html>`)

	message := []byte("From: " + from + "\r\n" +
		"To: " + strings.Join(to, ",") + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\";\r\n\r\n" +
		body)

	auth := smtp.PlainAuth("", "levitec@ifctransfer.com", "hisgpmbyl2vN[:", "smtp.dondominio.com")

	err = smtp.SendMail("smtp.dondominio.com:587", auth, from, to, message)
	if err != nil {
		return c.JSON(fiber.Map{
			"message": "No se ha podido enviar el correo de recuperación de contraseña",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Correo enviado",
	})
}

func PasswordReset(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	var passwordReset model.PasswordRecover
	err = database.DB.QueryRow("SELECT id, email, token FROM password_recovers WHERE token = ?", data["token"]).Scan(&passwordReset.ID, &passwordReset.Email, &passwordReset.Token)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No se puede cambiar la contraseña"})
		}
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	_, err = database.DB.Exec("UPDATE users SET password = ? WHERE email = ?", password, passwordReset.Email)
	if err != nil {
		return err
	}

	// Eliminar el token de recuperación de contraseña de la base de datos
	_, err = database.DB.Exec("DELETE FROM password_recovers WHERE token = ?", data["token"])
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Contraseña actualizada",
	})
}

func RandString(n int) string {
	var letter = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	b := make([]rune, n)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}

func ActualizarNombre(c *fiber.Ctx) error {
	var data map[string]interface{}
	fmt.Println(data)

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	id := int(data["id"].(float64))

	_, err = database.DB.Exec("UPDATE users SET name = ? WHERE id = ?", data["name"], id)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Nombre actualizado",
	})
}

func CambiarContrasena(c *fiber.Ctx) error {
	var data map[string]interface{}

	// Parsear el cuerpo de la solicitud
	err := c.BodyParser(&data)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error en el cuerpo de la solicitud",
		})
	}

	id := int(data["id"].(float64))
	oldPassword := data["oldPassword"].(string)
	newPassword := data["newPassword"].(string)

	// Obtener la contraseña actual del usuario
	var storedPassword string
	err = database.DB.QueryRow("SELECT password FROM users WHERE id = ?", id).Scan(&storedPassword)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error al recuperar la contraseña del usuario",
		})
	}

	// Verificar la contraseña actual
	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(oldPassword))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Contraseña actual incorrecta",
		})
	}

	// Generar la nueva contraseña encriptada
	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error al encriptar la nueva contraseña",
		})
	}

	// Actualizar la contraseña en la base de datos
	_, err = database.DB.Exec("UPDATE users SET password = ? WHERE id = ?", newHashedPassword, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error al actualizar la contraseña",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Contraseña actualizada correctamente",
	})
}

func DarAdmin(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	id := int(data["id"].(float64))

	_, err = database.DB.Exec("UPDATE users SET role = 'admin' WHERE id = ?", id)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Usuario actualizado",
	})
}

func QuitarAdmin(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	id := int(data["id"].(float64))

	_, err = database.DB.Exec("UPDATE users SET role = 'user' WHERE id = ?", id)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Usuario actualizado",
	})
}

func InvitarUsuario(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	email := data["email"]

	// Verificar si el correo electrónico ya está en uso
	var count int
	err = database.DB.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", email).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		// Si el correo electrónico ya está en uso, devolver un error
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "El correo electrónico ya está en uso"})
	}

	token := RandString(16)

	// Preparar la declaración SQL para insertar el token de recuperación de contraseña en la base de datos
	stmt, err := database.DB.Prepare("INSERT INTO password_recovers (email, token) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Ejecutar la consulta SQL para insertar el token de recuperación de contraseña
	_, err = stmt.Exec(email, token)
	if err != nil {
		return err
	}

	from := "levitec@ifctransfer.com"
	to := []string{email}
	subject := "Invitacion a Levitec IFC transfer"
	url := "http://localhost:3000/invitar-usuarios?token=" + token
	body := (`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
	  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta name="x-apple-disable-message-reformatting">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <title></title>

		<style type="text/css">
		  @media only screen and (min-width: 620px) {
	  .u-row {
		width: 600px !important;
	  }
	  .u-row .u-col {
		vertical-align: top;
	  }

	  .u-row .u-col-100 {
		width: 600px !important;
	  }

	}

	@media (max-width: 620px) {
	  .u-row-container {
		max-width: 100% !important;
		padding-left: 0px !important;
		padding-right: 0px !important;
	  }
	  .u-row .u-col {
		min-width: 320px !important;
		max-width: 100% !important;
		display: block !important;
	  }
	  .u-row {
		width: 100% !important;
	  }
	  .u-col {
		width: 100% !important;
	  }
	  .u-col > div {
		margin: 0 auto;
	  }
	}
	body {
	  margin: 0;
	  padding: 0;
	}

	table,
	tr,
	td {
	  vertical-align: top;
	  border-collapse: collapse;
	}

	p {
	  margin: 0;
	}

	.ie-container table,
	.mso-container table {
	  table-layout: fixed;
	}

	* {
	  line-height: inherit;
	}

	a[x-apple-data-detectors='true'] {
	  color: inherit !important;
	  text-decoration: none !important;
	}
	.button-33 {
	  background-color: #e44604;
	  border-radius: 100px;
	  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
	  color: green;
	  cursor: pointer;
	  display: inline-block;
	  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
	  padding: 7px 20px;
	  text-align: center;
	  text-decoration: none;
	  transition: all 250ms;
	  border: 0;
	  font-size: 16px;
	  user-select: none;
	  -webkit-user-select: none;
	  touch-action: manipulation;
	}

	.button-33:hover {
	  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
	  transform: scale(1.05) rotate(-1deg);
	}
	table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
		</style>

	<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

	</head>

	<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f0f0f0;color: #000000">
	  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f0f0f0;width:100%" cellpadding="0" cellspacing="0">
	  <tbody>
	  <tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="background-color: #ddffe7;height: 100%;width: 100% !important;">
	<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

	<table width="100%" cellpadding="0" cellspacing="0" border="0">
	  <tr>
		<td style="padding-right: 0px;padding-left: 0px;" align="center">
		  <img src= style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 300px;" width="50%">
		</td>
	  </tr>
	</table>

		  </td>
		</tr>
	  </tbody>
	</table>

	</div>
	  </div>
	</div>

		</div>
	  </div>
	  </div>

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

		<h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span>Se te ha invitado a Levitec</span></span></span></h1>
		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

	  <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
		<p style="line-height: 140%;">Hola</p><br/>
        <p style="line-height: 140%;">Este correo ha sido enviado, para invitarte a unir a IFC-Levitec</p><br/><br/>
		<a style="text-decoration: none; color: #000000;" href="` + url + `"><button class="button-33"  role="button">Acceder para registrar</button></a>
	  </div>

		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

		  </td>
		</tr>
	  </tbody>
	</table>

	</div>
	  </div>
	</div>
		</div>
	  </div>
	  </div>

	<div class="u-row-container" style="padding: 2px 0px 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

		<h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 400;"><span><span><span><span><span>Si tiene alguna duda o ha recibido este correo por error contacte con nosotros en info@dcrow.tech.<br />O entre en nuestra pagina <a href="https://levitec.ifctransfer.com/dashboard"<strong>Levitec IFC transfer</strong></a> para más información.</span></span></span></span></span></h1>

		  </td>
		</tr>
	  </tbody>
	</table>

	</div>
	  </div>
	</div>
		</div>
	  </div>
	  </div>

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

	<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
	  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 0px 0px;font-family:arial,helvetica,sans-serif;" align="left">

	  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #000000;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
		<tbody>
		  <tr style="vertical-align: top">
			<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
			  <span>&#160;</span>
			</td>
		  </tr>
		</tbody>
	  </table>

		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;" align="left">

	  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #000000;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
		<tbody>
		  <tr style="vertical-align: top">
			<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
			  <span>&#160;</span>
			</td>
		  </tr>
		</tbody>
	  </table>

		  </td>
		</tr>
	  </tbody>
	</table>

	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 60px;font-family:arial,helvetica,sans-serif;" align="left">

		  </td>
		</tr>
	  </tbody>
	</table>

	  </div>
	</div>
		</div>
	  </div>
	  </div>
		</td>
	  </tr>
	  </tbody>
	  </table>
	</body>

	</html>`)

	message := []byte("From: " + from + "\r\n" +
		"To: " + strings.Join(to, ",") + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\";\r\n\r\n" +
		body)

	auth := smtp.PlainAuth("", "levitec@ifctransfer.com", "hisgpmbyl2vN[:", "smtp.dondominio.com")

	err = smtp.SendMail("smtp.dondominio.com:587", auth, from, to, message)
	if err != nil {
		return c.JSON(fiber.Map{
			"message": "No se ha podido enviar el correo de invitación",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Correo enviado",
	})
}

func RegistrarUsuarioInvitado(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	var passwordReset model.PasswordRecover
	err = database.DB.QueryRow("SELECT id, email, token FROM password_recovers WHERE token = ?", data["token"]).Scan(&passwordReset.ID, &passwordReset.Email, &passwordReset.Token)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No se puede registrar el usuario"})
		}
		return err
	}

	// Generación del hash de la contraseña del usuario
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	// Creación del usuario en la base de datos
	stmt, err := database.DB.Prepare("INSERT INTO users(name, email, password, created_at) VALUES(?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	createdAt := time.Now()

	_, err = stmt.Exec(data["nombre"], passwordReset.Email, password, createdAt)
	if err != nil {
		return err
	}

	// Eliminar el token de recuperación de contraseña de la base de datos
	_, err = database.DB.Exec("DELETE FROM password_recovers WHERE token = ?", data["token"])
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Usuario creado correctamente",
	})
}

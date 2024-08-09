package controller

import (
	"math/rand"
	"net/smtp"
	"strconv"
	"strings"
	"time"

	"principal/database"
	"principal/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

func GetUsers(c *fiber.Ctx) error {
	var users []model.User

	// Preload Projects to include them in the fetched data
	result := database.DBConn.Preload("Productos").Find(&users)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Usuarios no encontrados"})
	}
	return c.JSON(users)
}

func ControlLogin(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos de inicio de sesión del usuario
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Consulta del usuario desde la base de datos utilizando el correo electrónico proporcionado
	var user model.User
	database.DBConn.Where("email = ?", data["email"]).First(&user)

	// Verificación de si el usuario existe
	if user.ID == 0 {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Usuario no encontrado",
		})
	}

	// Verificación de la contraseña del usuario
	err = bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"]))
	if err != nil {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Contraseña incorrecta",
		})
	}

	// Creación del token JWT para la sesión del usuario
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})
	token, err := claims.SignedString([]byte(SecretKey))
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "No pude entrar a la cuenta",
		})
	}

	// Configuración de una cookie HTTP para almacenar el token JWT
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	// Respuesta JSON con un mensaje de éxito
	return c.JSON(user)
}

// ControlRegister registra un nuevo usuario en la base de datos y devuelve una respuesta JSON.
func ControlRegister(c *fiber.Ctx) error {
	// Análisis del cuerpo de la solicitud para obtener los datos del usuario
	var data map[string]string
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Generación del hash de la contraseña del usuario
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	// Creación del objeto de usuario con los datos proporcionados
	user := model.User{
		Name:     data["name"],
		Email:    data["email"],
		Role:     data["role"],
		Password: password,
	}

	// Creación del usuario en la base de datos
	database.DBConn.Create(&user)

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

	database.DBConn.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func PasswordRecover(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	// Consulta del usuario desde la base de datos utilizando el correo electrónico proporcionado
	var user model.User
	database.DBConn.Where("email = ?", data["email"]).First(&user)

	// Verificación de si el usuario existe
	if user.ID == 0 {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Usuario no encontrado",
		})
	}

	email := data["email"]
	token := RandString(16)

	PasswordReset := model.PasswordRecover{
		Email: email,
		Token: token,
	}

	database.DBConn.Create(&PasswordReset)

	from := "thedesb@gmail.com"
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
	
	table {
		background: #e44604 !important;
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
	  background-color: #c2fbd7;
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
			
		<h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span>Has click en este link para recuperar la contraseña</span></span></span></h1>
		  </td>
		</tr>
	  </tbody>
	</table>
	
	<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	  <tbody>
		<tr>
		  <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
			
	  <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
		<p style="line-height: 140%;">haz clik aqui` + url + `</strong>.</p>
		<p style="line-height: 140%; padding-bottom: 5%;"></p>
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
			
		<h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 400;"><span><span><span><span><span>Si ha tiene alguna duda o ha recibido este correo por error contacte con nosotros en thedesb@gmail.com.<br />O entre en nuestra pagina <a href="http://localhost:3000/"<strong>The DESB</strong></a> para más información.</span></span></span></span></span></h1>
	
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

	auth := smtp.PlainAuth("", "thedesb@gmail.com", "thedesb2001", "smtp.dondominio.com")

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
	database.DBConn.Where("token = ?", data["token"]).Last(&passwordReset)

	if passwordReset.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "No se ha podido cambiar la contraseña",
		})
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	database.DBConn.Model(&model.User{}).Where("email = ?", passwordReset.Email).Update("password", password)

	// Eliminar el token de recuperación de contraseña de la base de datos
	database.DBConn.Delete(&passwordReset)

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

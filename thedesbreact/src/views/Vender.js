import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dineroImg from '../assets/images/Dinero.jpg'; // Asegúrate de que la ruta sea correcta

const Vender = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: '',
    imagen: null,
    mensaje: '',
  });

  const [validated, setValidated] = useState(false);

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  // Envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      // Si hay una imagen, convierte la imagen a base64
      if (formData.imagen) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result; // Resultado de la imagen en base64

          const templateParams = {
            nombre: formData.nombre,
            email: formData.email,
            tipo: formData.tipo,
            mensaje: formData.mensaje,
            imagen: `<img src="${base64Image}" alt="Imagen del producto" style="max-width: 100%; height: auto; border: 2px solid #ddd; border-radius: 8px;"/>`,
          };

          sendEmail(templateParams); // Envía el correo con los parámetros de la plantilla
        };
        reader.readAsDataURL(formData.imagen); // Lee el archivo como una URL de datos
      } else {
        // Si no hay imagen, envía los datos normalmente
        const templateParams = {
          nombre: formData.nombre,
          email: formData.email,
          tipo: formData.tipo,
          mensaje: formData.mensaje,
          imagen: '',
        };

        sendEmail(templateParams);
      }
    }
  };

  // Función para enviar el correo electrónico
  const sendEmail = (templateParams) => {
    emailjs
      .send(
        'service_a83nc3q', // Reemplaza con tu Service ID de EmailJS
        'template_p2e7vz2', // Reemplaza con tu Template ID de EmailJS
        templateParams,
        'jggkVv27i9fyFpxTx' // Reemplaza con tu Public Key de EmailJS
      )
      .then(
        (response) => {
          toast.success('¡Mensaje enviado con éxito!', {
            position: 'bottom-right',
          });
          setFormData({
            nombre: '',
            email: '',
            tipo: '',
            imagen: null,
            mensaje: '',
          });
          setValidated(false);
        },
        (error) => {
          toast.error('Hubo un error al enviar el mensaje.', {
            position: 'bottom-right',
          });
          console.error('Error al enviar el mensaje:', error);
        }
      );
  };

  return (
    <div id="root">
      <Navbar />
      <div className="content py-5">
        <Container fluid>
          {/* Div de presentación */}
          <div className="presentation text-center mb-4">
            <h1>Vende o Intercambia</h1>
            <p style={{ color: 'black' }}>Vamos a darle una vida útil a ese producto.</p>
          </div>
          {/* Sección de la imagen */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12}>
              <div className="mb-4">
                <img
                  src={dineroImg}
                  alt="Imagen Destacada"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '2px solid #000000',
                  }}
                />
              </div>
              <div className="text-center mb-4">
                <p style={{ fontSize: '1.2rem', color: 'black' }}>
                  Recibe pagos rápido mediante Bizum, PayPal y muchos más.
                </p>
              </div>
            </Col>
          </Row>
          {/* Sección del formulario y explicación */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12} className="d-flex flex-column">
              {/* Div explicativo */}
              <Col md={12} className="mb-4">
                <div>
                  <h2>Obtén dinero rápido</h2>
                  <h4>¿Tienes videojuegos antiguos que quieres mover?</h4>
                  <p>
                    Llámenos, envíenos un correo electrónico o rellene el formulario. Nuestra línea telefónica de atención al cliente está abierta de 9:00 de la mañana a 18:30 de la tarde hora española. Puede esperar una respuesta por correo electrónico dentro de 24 a 48 horas hábiles.<br /><br />
                    <strong>Número de teléfono:</strong> <a href="tel:+34636239696" style={{ color: '#e44604', textDecoration: 'underline' }}>+34 636239696</a><br />
                    <strong>Correo electrónico:</strong> <a href="mailto:thedesborigin@gmail.com" style={{ color: '#e44604', textDecoration: 'underline' }}>thedesborigin@gmail.com</a>
                  </p>
                  <p style={{ marginTop: '10px' }}>
                    Recuerda escribirnos por el chat si estás logueado en la página web para cualquier duda.
                  </p>
                </div>
              </Col>
              {/* Formulario de contacto */}
              <Col md={12}>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    border: `2px solid #000000`,
                  }}
                >
                  <Form.Group controlId="formNombre" className="mb-3">
                    <Form.Label>Nombre y Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Introduce tu nombre y apellidos"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, introduce tu nombre y apellidos.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Introduce tu email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, introduce un correo electrónico válido.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formTipo" className="mb-3">
                    <Form.Label>Tipo de Artículo</Form.Label>
                    <Form.Control as="select" name="tipo" value={formData.tipo} onChange={handleChange} required>
                      <option value="">Selecciona una opción</option>
                      <option value="consola">Consola</option>
                      <option value="videojuego">Videojuego</option>
                      <option value="accesorio">Accesorio</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Por favor, selecciona un tipo de artículo.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formImagen" className="mb-3">
                    <Form.Label>Imagen del Artículo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      name="imagen"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formMensaje" className="mb-4">
                    <Form.Label>Mensaje y Motivo</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Introduce tu mensaje y motivo"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, introduce tu mensaje y motivo.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      backgroundColor: '#000000',
                      borderColor: '#000000',
                      fontSize: '1.2rem',
                      marginTop: '10px',
                      transition: 'background-color 0.3s, border-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e44604';
                      e.target.style.borderColor = '#e44604';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#000000';
                      e.target.style.borderColor = '#000000';
                    }}
                  >
                    Enviar
                  </Button>
                </Form>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Vender;

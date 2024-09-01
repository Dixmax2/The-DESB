import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [validated, setValidated] = useState(false);

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Verifica si el formulario es válido
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      // Envía el correo utilizando EmailJS
      emailjs
        .send(
          'service_90r12w4', // Reemplaza con tu Service ID de EmailJS
          'template_qods83h', // Reemplaza con tu Template ID de EmailJS
          formData,
          'jggkVv27i9fyFpxTx' // Reemplaza con tu Public Key de EmailJS
        )
        .then(
          () => {
            toast.success('¡Mensaje enviado con éxito!');
            setFormData({ nombre: '', email: '', mensaje: '' });
            setValidated(false); // Resetea la validación
          },
          (error) => {
            toast.error('Hubo un error al enviar el mensaje.');
            console.error(error);
          }
        );
    }
  };

  return (
    <div id="root">
      <Navbar />
      <div className="content py-5">
        <Container>
          {/* Card de presentación */}
          <Card
            className="mb-4 text-white text-center"
            style={{ backgroundColor: '#000000', padding: '20px' }} // Fondo negro
          >
            <Card.Body>
              <h1>Contáctenos</h1>
              <p>
                Estamos aquí para ayudarte. Si tienes alguna pregunta o
                necesitas asistencia, por favor, ponte en contacto con nosotros.
              </p>
            </Card.Body>
          </Card>

          {/* Sección del formulario y explicación */}
          <Row className="justify-content-center">
            <Col md={6} className="mb-4">
              <div className="mb-4">
                <h2>Información de Contacto</h2>
                <h4>¿Necesita ayuda?</h4>
                <p>
                  Llámenos, envíenos un correo electrónico o rellene el
                  formulario. Nuestra línea telefónica de atención al cliente
                  está abierta de 9:00 de la mañana a 18:30 de la tarde hora
                  española. Puede esperar una respuesta por correo electrónico
                  dentro de 24 a 48 horas hábiles.
                </p>
                <p>
                  <strong>Número de teléfono:</strong>{' '}
                  <a
                    href="tel:+34636239696"
                    style={{ color: '#e44604', textDecoration: 'underline' }} // Actualizado
                  >
                    +34 636239696
                  </a>
                  <br />
                  <strong>Correo electrónico:</strong>{' '}
                  <a
                    href="mailto:thedesborigin@gmail.com"
                    style={{ color: '#e44604', textDecoration: 'underline' }} // Actualizado
                  >
                    thedesborigin@gmail.com
                  </a>
                </p>
                <p style={{ marginTop: '10px' }}>
                  Recuerda escribirnos por el chat si estás logueado en la
                  página web para cualquier duda.
                </p>
              </div>
            </Col>

            {/* Formulario de contacto */}
            <Col md={6}>
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
                <Form.Group controlId="formMensaje" className="mb-4">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Introduce tu mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor, introduce tu mensaje.
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
          </Row>
        </Container>
        {/* Contenedor de notificaciones */}
        <ToastContainer theme="colored" position="bottom-right" hideProgressBar closeOnClick />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

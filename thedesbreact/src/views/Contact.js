import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Contact = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content py-5">
        <Container>
          {/* Div de presentación */}
          <div className="presentation text-center mb-4">
            <h1>Contáctenos</h1>
            <p>Estamos aquí para ayudarte. Si tienes alguna pregunta o necesitas asistencia, por favor, ponte en contacto con nosotros.</p>
          </div>
          
          {/* Sección del formulario y explicación */}
          <Row className="justify-content-center">
            <Col md={6} className="mb-4">
              {/* Div explicativo */}
              <div className="mb-4">
                <h2>Información de Contacto</h2>
                <p>
                  ¿Necesita ayuda?<br />
                  Llámenos, envíenos un correo electrónico o rellene el formulario. Nuestra línea telefónica de atención al cliente está abierta de 10 a. m. a 5 p. m. MST. Puede esperar una respuesta por correo electrónico dentro de 24 a 48 horas hábiles.
                </p>
                <p>
                  <strong>Número de teléfono:</strong> <a href="tel:+18775201219" style={{ color: 'blue', textDecoration: 'underline' }}>+1 (877) 520-1219</a><br />
                  <strong>Correo electrónico:</strong> <a href="mailto:Ayuda@thevideogamecompany.com" style={{ color: 'blue', textDecoration: 'underline' }}>Ayuda@thevideogamecompany.com</a>
                </p>
              </div>
            </Col>
            
            {/* Formulario de contacto */}
            <Col md={6}>
              <Form>
                <Form.Group controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" placeholder="Introduce tu nombre" />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Introduce tu email" />
                </Form.Group>
                <Form.Group controlId="formMensaje">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Introduce tu mensaje" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Enviar
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

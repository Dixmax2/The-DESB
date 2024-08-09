import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Vender = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content d-flex align-items-center justify-content-center">
        <Container fluid>
          {/* Div de presentación */}
          <div className="presentation text-center mb-4">
            <h1>Bienvenido a nuestra página web</h1>
            <p>¡Aquí encontrarás todo lo que necesitas!</p>
          </div>
          {/* Una card grande con imagen a la derecha y texto a la izquierda */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12} className="mw-100">
              <Card className="d-flex flex-row">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Card.Title>Producto Destacado</Card.Title>
                  <Card.Text>
                    Aquí puedes encontrar una descripción detallada del producto destacado. Explica por qué este producto es especial y cómo puede beneficiar a los clientes.
                  </Card.Text>
                </Card.Body>
                <Card.Img variant="right" src="ruta/a/imagen_destacada.jpg" className="w-50" />
              </Card>
            </Col>
          </Row>
          {/* Sección del formulario y explicación */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12} className="d-flex">
              {/* Div explicativo */}
              <Col md={6} className="d-flex align-items-center">
                <div>
                  <h2>Obtenga dinero rápido</h2>
                  <p>¿Tienes videojuegos antiguos y quieres moverlos?<br />
                     Llámanos, envíanos un correo electrónico o completa el formulario con el juego que deseas vender. Nuestra línea telefónica está abierta de lunes a viernes de 11 a. m. a 5 p. m. MST. Puede esperar una respuesta en cuestión de horas.<br /><br />
                     <strong>Número de teléfono:</strong> +1 (877) 520-1219<br />
                     <strong>Correo electrónico:</strong> sellyourgames@thevideogamecompany.com
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
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Vender;

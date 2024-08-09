import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Terminos = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content d-flex align-items-center justify-content-center">
        <Container fluid>
          {/* Card de presentación */}
          <Card className="text-center mb-4">
            <Card.Body>
              <Card.Title>Sobre Nosotros</Card.Title>
              <Card.Text>Conoce más sobre nuestra empresa y equipo.</Card.Text>
            </Card.Body>
          </Card>
          {/* Sección de contenido principal con imagen a la izquierda y texto a la derecha */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12} className="mw-100 d-flex">
              <Col md={4}>
                <Image src="ruta/a/imagen_equipo.jpg" fluid />
              </Col>
              <Col md={8}>
                <h2>Nuestra Historia</h2>
                <p>
                  En The Video Game Company, nos apasiona el mundo de los videojuegos. Desde nuestros inicios, nos hemos dedicado a proporcionar a nuestros clientes una amplia gama de juegos clásicos y modernos. Nuestro equipo está compuesto por entusiastas de los videojuegos que entienden y comparten tu pasión.
                </p>
                <h2>Nuestra Misión</h2>
                <p>
                  Nuestra misión es ofrecer un servicio excepcional a los amantes de los videojuegos en todo el mundo. Nos esforzamos por ser la mejor opción para comprar, vender e intercambiar videojuegos, brindando una experiencia de cliente inigualable.
                </p>
                <h2>Conoce al Equipo</h2>
                <p>
                  Nuestro equipo está compuesto por expertos en videojuegos y coleccionistas que están aquí para ayudarte a encontrar exactamente lo que estás buscando. Ya sea que necesites asesoramiento sobre el valor de un juego raro o simplemente quieras discutir sobre los últimos lanzamientos, estamos aquí para ayudarte.
                </p>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Terminos;

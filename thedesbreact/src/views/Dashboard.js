import React from 'react';
import { Container, Row, Col, Card, Carousel, Image } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

import principalImage from '../assets/images/principal.jpg';
import nin from '../assets/images/nin.jpg';
import ps from '../assets/images/ps.jpg';
import xbox from '../assets/images/xbox.jpg';
import nintendoImage from '../assets/images/nintendo.jpg';
import fifaImage from '../assets/images/fifa.jpg';
import zeldaImage from '../assets/images/zelda.jpg';

const Dashboard = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content d-flex align-items-center justify-content-center">
        <Container fluid>
          {/* Div de presentación */}
          <div className="presentation text-center mb-4" style={{ marginTop: '30px' }}>
            <h1>Bienvenido a nuestra página The DEBS</h1>
            {/* Actualización del texto y color */}
            <p style={{ color: 'black' }}>
              Aquí encontrarás todo lo que necesitas sobre videojuegos de segunda mano, consolas y mucho más.
            </p>
          </div>

          {/* Card principal con imagen sin descripción */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12}>
              <Card className="text-center" style={{ border: '2px solid #e44604', marginBottom: '30px' }}>
                {/* Imagen añadida a la card */}
                <Card.Img variant="top" src={principalImage} alt="Imagen principal" />
              </Card>
            </Col>
          </Row>

          {/* Div con tres cards en línea */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12} className="mw-100">
              <div className="card-container d-flex justify-content-center">
                <Card className="mx-2" style={{ backgroundColor: 'black', color: 'white', border: '2px solid #e44604' }}>
                  <Card.Body>
                    <Card.Img variant="top" src={nin} alt="nin" />
                    <Card.Text>
                      Una de nuestras consolas favoritas
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card className="mx-2" style={{ backgroundColor: 'black', color: 'white', border: '2px solid #e44604' }}>
                  <Card.Body>
                    <Card.Img variant="top" src={ps} alt="ps" />
                    <Card.Text>
                      Nuestra consola más vendida
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card className="mx-2" style={{ backgroundColor: 'black', color: 'white', border: '2px solid #e44604' }}>
                  <Card.Body>
                    <Card.Img variant="top" src={xbox} alt="xbox" />
                    <Card.Text>
                      La consola con más juegos a día de hoy
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          {/* Texto encima del Carousel */}
          <div className="text-center mb-4">
            <p>
              Infórmate de las últimas noticias sobre las 
              <br />
              últimas novedades en el mundo gamer y los avances que quedan por llegar
              <br />
              sobre los videojuegos, consolas y mucho más de lo que te puedas imaginar.
            </p>
          </div>

          {/* Carousel modificado con mayor altura, separación y borde redondeado */}
          <div className="carousel-container d-flex justify-content-center mb-4">
            <Carousel
              style={{
                width: '800px',
                height: '500px', // Aumenta la altura del carousel
                border: '2px solid #e44604', // Aplica borde de color
                borderRadius: '15px', // Borde redondeado
                overflow: 'hidden', // Recorte para que el borde redondeado funcione correctamente
              }}
            >
              <Carousel.Item>
                <a href="https://vandal.elespanol.com/noticia/1350773906/nintendo-pone-a-un-espanol-al-frente-de-su-cupula-directiva-en-europa-reestructuracion-en-nintendo-of-europe/" target="_blank" rel="noopener noreferrer">
                  <Image
                    className="d-block w-100"
                    src={nintendoImage}
                    alt="First slide"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </a>
                <Carousel.Caption>
                  <h3>¿Su comunidad?</h3>
                  <p>Nintendo de nuevo</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <a href="https://vandal.elespanol.com/noticia/1350773908/ufl-confirma-los-temores-el-rival-de-ea-sports-fc-25-se-retrasa-y-no-llegara-hasta-finales-de-ano/" target="_blank" rel="noopener noreferrer">
                  <Image
                    className="d-block w-100"
                    src={fifaImage}
                    alt="Second slide"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </a>
                <Carousel.Caption>
                  <h2>Se retrasa !!</h2>
                  <p>Los accionados no aguantan mas</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <a href="https://vandal.elespanol.com/noticia/1350773902/nintendo-situa-a-zelda-breath-of-the-wild-y-tears-of-the-kingdom-fuera-de-la-linea-temporal-de-la-saga/" target="_blank" rel="noopener noreferrer">
                  <Image
                    className="d-block w-100"
                    src={zeldaImage}
                    alt="Third slide"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </a>
                <Carousel.Caption>
                  <h3>Nuevas Aventuras</h3>
                  <p>Todo un mundo de Fantasia y esperanza</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

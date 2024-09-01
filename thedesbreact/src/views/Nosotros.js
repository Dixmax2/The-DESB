import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import DESB from '../assets/images/DESB.png';
import Foto from '../assets/images/julio.jpg';
import Mision from '../assets/images/mision.jpg';
import '../css/Nosotros.css'; // Asegúrate de importar el archivo CSS

const Nosotros = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content">
        <Container fluid>
          {/* Card de presentación */}
          <Card className="text-center mb-4 custom-card">
            <Card.Body>
              <Card.Title className="custom-card-title">The DESB</Card.Title>
              <Card.Text className="custom-card-text">
                Conoce más sobre nuestra empresa y equipo.
              </Card.Text>
            </Card.Body>
          </Card>
          {/* Sección de contenido principal con imagen a la izquierda y texto a la derecha */}
          <Row className="mb-5">
            {/* Fila 1 */}
            <Col xl={8} md={12} className="row-content">
              <div className="col-image">
                <Image src={DESB} className="custom-image" />
              </div>
              <div className="col-text">
                <h2>Nuestra Historia</h2>
                <p>
                  The DESB (Digital Exchange Sell Buy) es una página web fundada en 2024 en un local de Zaragoza,
                  por el desarrollador/director Julio Bielsa Muñoz con una gran idea y visión clara. Nos apasiona el
                  mundo de los videojuegos y el mercado de la segunda mano. Desde nuestros inicios, nos hemos dedicado a
                  proporcionar a nuestros clientes una amplia gama de videojuegos clásicos y modernos, tanto como consolas
                  y accesorios. Nuestro equipo está compuesto por entusiastas de los videojuegos que entienden y comparten
                  tu pasión por el coleccionismo.
                </p>
              </div>
            </Col>
            {/* Fila 2 */}
            <Col xl={8} md={12} className="row-content">
              <div className="col-image">
                <Image src={Mision} className="custom-image" />
              </div>
              <div className="col-text">
                <h2>Nuestra Misión</h2>
                <p>
                  Nuestra misión es ofrecer un servicio excepcional a los amantes y coleccionistas de los videojuegos,
                  consolas y accesorios, en España y Europa. Nos esforzamos por ser la mejor opción para comprar, vender
                  e intercambiar videojuegos, consolas y accesorios, brindando una experiencia de cliente inigualable.
                </p>
              </div>
            </Col>
            {/* Fila 3 */}
            <Col xl={8} md={12} className="row-content">
              <div className="col-image">
                <Image src={Foto} className="custom-image" />
              </div>
              <div className="col-text">
                <h2>Conoce al Equipo</h2>
                <p>
                  Nuestro equipo está compuesto por expertos en videojuegos y coleccionistas que están aquí para ayudarte a
                  encontrar exactamente lo que estás buscando. Su fundador, Julio Bielsa Muñoz, entusiasta de los videojuegos,
                  cuenta con un equipo de técnicos superiores especializados, cada uno en su rama. Ya sea que necesites
                  asesoramiento sobre el valor de un juego raro o simplemente quieras discutir sobre los últimos lanzamientos,
                  estamos aquí para ayudarte en todo lo necesario.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Nosotros;

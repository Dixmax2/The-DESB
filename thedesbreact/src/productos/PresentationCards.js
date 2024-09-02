import React from 'react';
import { Row, Col, Card, Image } from 'react-bootstrap';

import image1 from '../assets/images/nin.jpg'; // Asegúrate de tener estas imágenes en las rutas correctas
import image2 from '../assets/images/ps.jpg';
import image3 from '../assets/images/xbox.jpg';

const PresentationCards = () => {
  return (
    <Row className="my-4">
      <Col xs={12} md={4}> {/* Columna más estrecha para tarjetas más pequeñas */}
        <Card className="presentation-card" style={{ width: '18rem', margin: '0 auto' }}> {/* Ajusta el tamaño de la tarjeta */}
          <Card.Body className="text-center"> {/* Centramos el contenido */}
            <Image src={image1} alt="Presentación 1" style={{ width: '100px', height: 'auto' }} /> {/* Imagen más pequeña */}
            <Card.Title className="mt-3">Nintendo</Card.Title> {/* Título con margen superior */}
            <Card.Text>Consola más vendida</Card.Text> {/* Descripción actualizada */}
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={4}>
        <Card className="presentation-card" style={{ width: '18rem', margin: '0 auto' }}>
          <Card.Body className="text-center">
            <Image src={image2} alt="Presentación 2" style={{ width: '100px', height: 'auto' }} /> {/* Imagen más pequeña */}
            <Card.Title className="mt-3">PS4</Card.Title>
            <Card.Text>Consola más utilizada</Card.Text> {/* Descripción actualizada */}
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={4}>
        <Card className="presentation-card" style={{ width: '18rem', margin: '0 auto' }}>
          <Card.Body className="text-center">
            <Image src={image3} alt="Presentación 3" style={{ width: '100px', height: 'auto' }} /> {/* Imagen más pequeña */}
            <Card.Title className="mt-3">Xbox</Card.Title>
            <Card.Text>Consola con más juegos</Card.Text> {/* Descripción actualizada */}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PresentationCards;

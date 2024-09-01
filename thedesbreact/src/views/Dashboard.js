import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Dashboard = () => {
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
          {/* Div con tres cards en línea */}
          <Row className="justify-content-center mb-4">
            <Col xl={8} md={12} className="mw-100">
              <div className="card-container d-flex justify-content-center">
                <Card>
                  <Card.Body>
                    <Card.Title>Card 1</Card.Title>
                    <Card.Text>
                      Contenido de la primera tarjeta.
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Card.Title>Card 2</Card.Title>
                    <Card.Text>
                      Contenido de la segunda tarjeta.
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Card.Title>Card 3</Card.Title>
                    <Card.Text>
                      Contenido de la tercera tarjeta.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
          {/* Div con un iframe */}
          <div className="video-container d-flex justify-content-center">
            <iframe
              width="800"
              height="400"
              src="https://www.youtube.com/embed/QHHmVoKoxRE?si=cmfz34wflAsOf9eg"
              title="YouTube video player"
              frameBorder="0" // corregido
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" // corregido
              referrerPolicy="strict-origin-when-cross-origin" // corregido
              allowFullScreen // corregido
            />
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

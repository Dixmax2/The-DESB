import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const PresentationCards = () => {
  return (
    <Row className="my-4">
      <Col>
        <Card className="presentation-card">
          <Card.Body>
            <Card.Title>Presentación 1</Card.Title>
            <Card.Text>Descripción breve.</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="presentation-card">
          <Card.Body>
            <Card.Title>Presentación 2</Card.Title>
            <Card.Text>Descripción breve.</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="presentation-card">
          <Card.Body>
            <Card.Title>Presentación 3</Card.Title>
            <Card.Text>Descripción breve.</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PresentationCards;

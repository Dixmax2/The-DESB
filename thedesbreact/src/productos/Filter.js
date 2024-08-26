// src/componentes/Filter.js

import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import '../css/filter.css';  // Archivo CSS para estilos personalizados

const Filter = () => {
  return (
    <Card className="filter-card sticky-filter">
      <Card.Body>
        <Card.Title className="filter-title">
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filtrar productos
        </Card.Title>
        
        <Form>
          {/* Categoría */}
          <Form.Group controlId="categoryFilter">
            <Form.Label className="filter-section-title">Categoría</Form.Label>
            <Form.Check type="checkbox" label="Juegos" />
            <Form.Check type="checkbox" label="Consolas" />
            <Form.Check type="checkbox" label="Accesorios" />
          </Form.Group>

          {/* Precio */}
          <Form.Group controlId="priceFilter" className="mt-3">
            <Form.Label className="filter-section-title">Precio</Form.Label>
            <Form.Check type="checkbox" label="Menos de $20" />
            <Form.Check type="checkbox" label="$20 - $50" />
            <Form.Check type="checkbox" label="Más de $50" />
          </Form.Group>

          {/* Disponibilidad */}
          <Form.Group controlId="availabilityFilter" className="mt-3">
            <Form.Label className="filter-section-title">Disponibilidad</Form.Label>
            <Form.Check type="checkbox" label="En Stock" />
            <Form.Check type="checkbox" label="Agotado" />
          </Form.Group>

          {/* Condición del producto */}
          <Form.Group controlId="conditionFilter" className="mt-3">
            <Form.Label className="filter-section-title">Condición del producto</Form.Label>
            <Form.Check type="checkbox" label="Aceptable (13)" />
            <Form.Check type="checkbox" label="Feria (1200)" />
            <Form.Check type="checkbox" label="Bueno (1212)" />
            <Form.Check type="checkbox" label="Bueno/ Completo (1)" />
            <Form.Check type="checkbox" label="Muy bueno (1213)" />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Filter;


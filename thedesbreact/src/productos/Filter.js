// src/componentes/Filter.js

import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import '../css/filter.css';  // Archivo CSS para estilos personalizados

const Filter = ({ onFilterChange }) => {
  // Estado local para manejar cambios en los filtros
  const [localFilters, setLocalFilters] = React.useState({
    type: { Videojuego: false, Consola: false, Accesorio: false }, // Cambio de "category" a "type"
    price: { 'Menos de $20': false, '$20 - $50': false, 'Más de $50': false },
    availability: { 'En Stock': false, Agotado: false },
  });

  // Manejador de cambios para los filtros
  const handleCheckboxChange = (section, name) => {
    const updatedFilters = {
      ...localFilters,
      [section]: {
        ...localFilters[section],
        [name]: !localFilters[section][name],
      },
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Card className="filter-card sticky-filter">
      <Card.Body>
        <Card.Title className="filter-title">
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filtrar productos
        </Card.Title>
        
        <Form>
          {/* Tipo */}
          <Form.Group controlId="typeFilter">
            <Form.Label className="filter-section-title">Tipo</Form.Label>
            <Form.Check 
              type="checkbox" 
              label="Videojuego" 
              checked={localFilters.type.Videojuego} 
              onChange={() => handleCheckboxChange('type', 'Videojuego')} 
            />
            <Form.Check 
              type="checkbox" 
              label="Consola" 
              checked={localFilters.type.Consola} 
              onChange={() => handleCheckboxChange('type', 'Consola')} 
            />
            <Form.Check 
              type="checkbox" 
              label="Accesorio" 
              checked={localFilters.type.Accesorio} 
              onChange={() => handleCheckboxChange('type', 'Accesorio')} 
            />
          </Form.Group>

          {/* Precio */}
          <Form.Group controlId="priceFilter" className="mt-3">
            <Form.Label className="filter-section-title">Precio</Form.Label>
            <Form.Check 
              type="checkbox" 
              label="Menos de $20" 
              checked={localFilters.price['Menos de $20']} 
              onChange={() => handleCheckboxChange('price', 'Menos de $20')} 
            />
            <Form.Check 
              type="checkbox" 
              label="$20 - $50" 
              checked={localFilters.price['$20 - $50']} 
              onChange={() => handleCheckboxChange('price', '$20 - $50')} 
            />
            <Form.Check 
              type="checkbox" 
              label="Más de $50" 
              checked={localFilters.price['Más de $50']} 
              onChange={() => handleCheckboxChange('price', 'Más de $50')} 
            />
          </Form.Group>

          {/* Disponibilidad */}
          <Form.Group controlId="availabilityFilter" className="mt-3">
            <Form.Label className="filter-section-title">Disponibilidad</Form.Label>
            <Form.Check 
              type="checkbox" 
              label="En Stock" 
              checked={localFilters.availability['En Stock']} 
              onChange={() => handleCheckboxChange('availability', 'En Stock')} 
            />
            <Form.Check 
              type="checkbox" 
              label="Agotado" 
              checked={localFilters.availability.Agotado} 
              onChange={() => handleCheckboxChange('availability', 'Agotado')} 
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Filter;

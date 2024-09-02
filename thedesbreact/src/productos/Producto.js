// src/componentes/Producto.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCartContext } from '../contexto/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faTruckFast, faLeaf, faScrewdriverWrench, faCircleCheck, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Producto = () => {
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { state, dispatch } = useCartContext();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-productos/${id}`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error fetching product details: ", error);
        setError("Error fetching product details.");
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: producto });
    toast.success(`¡Producto ${producto.name} añadido al carrito!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!producto) {
    return <div>Cargando...</div>;
  }

  return (
    <div id="root">
      <Navbar />
      <div className="content d-flex align-items-center justify-content-center">
        <Container>
          <Row className="my-4">
            <Col md={6}>
              <Card.Img 
                variant="top" 
                src={`http://localhost:4000/projects/${producto.id}/${producto.miniatura}`} 
                className="product-image"
              />
            </Col>
            <Col md={6}>
              <Card className="product-card">
                <Card.Body>
                  <div className="certification-title">
                    <FontAwesomeIcon icon={faCircleCheck} className="icon-certified" />
                    <span>Certificado aprobado</span>
                  </div>

                  <Card.Title className="product-title">{producto.name}</Card.Title>

                  <Card.Text className="product-price">€{producto.precio} EUR</Card.Text>

                  <Card.Text className="product-description">
                    <strong>Descripción:</strong> {producto.descripcion}
                  </Card.Text>

                  <Button className="btn-add-to-cart" variant="dark" onClick={handleAddToCart}>
                    Añadir al carro
                  </Button>
                </Card.Body>
              </Card>

              <div className="product-info mt-4">
                <h4 className="info-title">¿Por qué nosotros?</h4>
                <Row>
                  <Col md={6} className="info-item">
                    <FontAwesomeIcon icon={faTruckFast} />
                    <span className="info-text">Envío rápido</span>
                  </Col>
                  <Col md={6} className="info-item">
                    <FontAwesomeIcon icon={faAward} />
                    <span className="info-text">Garantía de 60 días</span>
                  </Col>
                  <Col md={6} className="info-item">
                    <FontAwesomeIcon icon={faLeaf} />
                    <span className="info-text">Cada compra evita que los desechos electrónicos terminen en los vertederos</span>
                  </Col>
                  <Col md={6} className="info-item">
                    <FontAwesomeIcon icon={faScrewdriverWrench} />
                    <span className="info-text">Limpiado y probado profesionalmente</span>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Producto;

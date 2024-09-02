import React from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexto/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/Modales.css'; // Asegúrate de que estos estilos se actualicen

const Modales = ({ showCarro, handleCloseCarro, showLupa, handleCloseLupa }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();
  const { state, dispatch } = useCartContext(); // Importa el estado y el despachador del contexto del carrito

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      handleCloseLupa(); // Cerrar el modal de búsqueda después de buscar
    }
  };

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2);
  };

  // Calcular el número total de productos en el carrito
  const calculateTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (showCarro) {
    return (
      <Offcanvas placement="end" show={showCarro} onHide={handleCloseCarro}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Carro ({calculateTotalItems()} {calculateTotalItems() === 1 ? 'artículo' : 'artículos'})
          </Offcanvas.Title> {/* Mostrar el número total de artículos en el carrito */}
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          {state.items.length > 0 ? (
            <>
              <div className="cart-items">
                <ul className="list-unstyled">
                  {state.items.map((item) => (
                    <li key={item.id} className="d-flex align-items-center mb-3">
                      <img
                        src={`http://localhost:4000/projects/${item.id}/${item.miniatura}`}
                        alt={item.name}
                        className="cart-item-image me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="cart-item-details flex-grow-1">
                        <div className="cart-item-name" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {item.name}
                        </div>
                        <div className="cart-item-price" style={{ fontSize: '1rem' }}>
                          €{item.precio} x {item.quantity}
                        </div>
                      </div>
                      <Button variant="link" onClick={() => handleRemove(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cart-footer">
                <div className="cart-total d-flex justify-content-between align-items-center">
                  <span>Total:</span>
                  <span>€{calculateTotal()}</span>
                </div>
                <Button
                  variant="dark"
                  className="btn-pay"
                  onClick={() => navigate('/checkout')} // Redirige a la página de checkout
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Pagar
                </Button>
              </div>
            </>
          ) : (
            <div className="empty-cart text-center">
              <FontAwesomeIcon icon={faShoppingCart} size="3x" />
              <p>Tu carrito está vacío</p>
              <p>0 artículos</p>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  if (showLupa) {
    return (
      <Offcanvas placement="end" show={showLupa} onHide={handleCloseLupa}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Buscar Producto</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="searchForm">
              <Form.Control
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Buscar
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  return null; // Si no se muestran modales, no renderizar nada
};

export default Modales;

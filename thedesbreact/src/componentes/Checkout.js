import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert,Image } from 'react-bootstrap';
import { useCartContext } from '../contexto/CartContext';
import { useNavigate } from 'react-router-dom';
import '../css/Checkout.css'; 
import logo from '../assets/images/DESBnegativo.png'; // Importa la imagen

const Checkout = () => {
  const [billingInfo, setBillingInfo] = useState({
    country: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: '',
    payWithPaypal: false,
  });
  const { state, dispatch } = useCartContext(); // Importa el despachador del contexto del carrito
  const navigate = useNavigate();
  const [alertVisible, setAlertVisible] = useState(false);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar si todos los campos del formulario están completos
    if (
      !billingInfo.country ||
      !billingInfo.address ||
      !billingInfo.city ||
      !billingInfo.postalCode ||
      !billingInfo.phone ||
      (!paymentInfo.payWithPaypal &&
        (!paymentInfo.cardNumber ||
          !paymentInfo.cardHolder ||
          !paymentInfo.expirationDate ||
          !paymentInfo.cvv))
    ) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    // Mostrar alerta de éxito
    setAlertVisible(true);

    // Limpiar el carrito
    dispatch({ type: 'CLEAR_CART' });

    // Redirigir a la página de inicio después de un breve retraso
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2);
  };

  const handleBackToHome = () => {
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <Container fluid className="checkout-container">
      {alertVisible && (
        <Alert variant="success" className="text-center">
          Su pedido ha sido realizado, ¡muchas gracias por confiar en nosotros!
        </Alert>
      )}
      <Row>
        <Col className="text-center mb-4">
        <Image
            src={logo}
            alt="Logo"
            className="logo-image"
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="billing-card">
            <Card.Body>
              <Card.Title>Información de Facturación</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="billingCountry">
                  <Form.Label>País</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="billingAddress">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={billingInfo.address}
                    onChange={handleBillingChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="billingCity">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleBillingChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="billingPostalCode">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={billingInfo.postalCode}
                    onChange={handleBillingChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="billingPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={billingInfo.phone}
                    onChange={handleBillingChange}
                    required
                  />
                </Form.Group>

                <Card.Title className="mt-4">Método de Pago</Card.Title>
                <Form.Check
                  type="checkbox"
                  id="payWithPaypal"
                  label="Pagar con PayPal"
                  checked={paymentInfo.payWithPaypal}
                  onChange={() => setPaymentInfo({ ...paymentInfo, payWithPaypal: !paymentInfo.payWithPaypal })}
                />

                {!paymentInfo.payWithPaypal && (
                  <>
                    <Form.Group controlId="cardNumber">
                      <Form.Label>Número de Tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="cardHolder">
                      <Form.Label>Nombre en la Tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardHolder"
                        value={paymentInfo.cardHolder}
                        onChange={handlePaymentChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="expirationDate">
                      <Form.Label>Fecha de Expiración</Form.Label>
                      <Form.Control
                        type="text"
                        name="expirationDate"
                        value={paymentInfo.expirationDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/AA"
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <Button type="submit" variant="dark" className="btn-pay mt-3">
                  Pagar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="order-summary-card">
            <Card.Body>
              <Card.Title>Resumen del Pedido</Card.Title>
              <ul className="list-unstyled">
                {state.items.map((item) => (
                  <li key={item.id} className="d-flex justify-content-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>€{item.precio * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>€{calculateTotal()}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="secondary" onClick={handleBackToHome}>
            Volver al Inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

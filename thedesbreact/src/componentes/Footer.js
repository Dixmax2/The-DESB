import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube, faTiktok, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import '../css/footer.css';

const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="footer-section">
          <h5>Compañía</h5>
          <ul className="footer-list">
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/vender">Vende Juegos</Link></li>
            <li><Link to="/contact">Contáctanos</Link></li>
          </ul>
        </Col>
        <Col className="footer-section">
          <h5>Soporte</h5>
          <ul className="footer-list">
            <li><Link to="/envio">Envío y seguimiento</Link></li>
            <li><Link to="/devolucion">Devoluciones, reembolsos y garantía</Link></li>
            <li><Link to="/terminos">Términos de servicio</Link></li>
            <li><Link to="/privacidad">Política de privacidad</Link></li>
          </ul>
        </Col>
        <Col className="footer-section">
          <h5>Redes Sociales</h5>
          <div className="footer-socials">
            <Link to="https://www.facebook.com/?locale=es_ES" className="social-icon">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </Link>
            <Link to="https://x.com/iniciarsesion?lang=es" className="social-icon">
              <FontAwesomeIcon icon={faSquareXTwitter} size="2x" />
            </Link>
            <Link to="https://www.instagram.com/" className="social-icon">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </Link>
            <Link to="https://www.youtube.com/" className="social-icon">
              <FontAwesomeIcon icon={faYoutube} size="2x" />
            </Link>
            <Link to="https://www.tiktok.com" className="social-icon">
              <FontAwesomeIcon icon={faTiktok} size="2x" />
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="footer-bottom">
        <Col>
          <p>© 2024, La empresa de videojuegos The DESB. Desarrollado por Julio Bielsa Muñoz</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;

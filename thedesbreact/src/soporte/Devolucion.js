import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Devolucion = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content py-5">
        <Container>
          <h1 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Devoluciones, reembolsos y garantía
          </h1>
          <div className="mx-auto" style={{ maxWidth: '800px', textAlign: 'justify', lineHeight: '1.8' }}>
            <p>
              En TheDESB, nos esforzamos por ofrecerle un proceso de devolución sencillo y sin complicaciones. Si necesita devolver su compra, por favor, tenga en cuenta las siguientes indicaciones:
            </p>
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Política de devoluciones y reembolsos</h2>
            <p>
              Usted tiene derecho a desistir de su compra en un plazo de 14 días naturales sin necesidad de justificación, comenzando desde la recepción del producto.
            </p>
            <p>
              <strong>Elegibilidad:</strong> 
              <br />
              • Para ejercer el derecho de desistimiento, el producto debe estar en perfecto estado y en su embalaje original.
              <br />
              • Los productos personalizados, perecederos o de higiene no se pueden devolver una vez desprecintados.
            </p>
            <p>
              <strong>Proceso de devolución:</strong>
              <br />
              • Contacte con nosotros en <a href="mailto:thedesborigin@gmail.com" style={{ color: '#e44604', textDecoration: 'underline' }}>thedesborigin@gmail.com</a>. Los costes de devolución correrán a cargo del cliente, salvo error por nuestra parte.
              <br />
              • Una vez recibida la devolución, reembolsaremos el importe pagado en un plazo máximo de 14 días.
            </p>
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Política de garantía</h2>
            <p>
              Todos nuestros productos de segunda mano tienen una garantía legal de 1 año conforme a la normativa española. Durante este periodo, puede solicitar reparación, sustitución o reembolso si el producto presenta un defecto de origen.
            </p>
            <p>
              Además, ofrecemos una garantía comercial adicional de 60 días desde la fecha de compra para devoluciones por cualquier motivo, garantizando su tranquilidad.
            </p>
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Iniciar una devolución o reclamación de garantía</h2>
            <p>
              • Para iniciar una devolución o reclamación de garantía, contacte con nosotros en <a href="mailto:thedesborigin@gmail.com" style={{ color: '#e44604', textDecoration: 'underline' }}>thedesborigin@gmail.com</a>.
              <br />
              • Le responderemos en un plazo de 48 horas con las instrucciones necesarias.
              <br />
              • Los gastos de envío serán reembolsados en caso de defecto o error en el pedido.
            </p>
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Términos adicionales</h2>
            <p>
              • No aceptamos devoluciones fuera del periodo legal de 14 días, ni productos que no estén en condiciones originales.
            </p>
            <p>
              Estamos aquí para garantizar su satisfacción. No dude en contactarnos mediante el correo electrónico <a href="mailto:thedesborigin@gmail.com" style={{ color: '#e44604', textDecoration: 'underline' }}>thedesborigin@gmail.com</a>, llamando al número de teléfono <span style={{ color: '#e44604', textDecoration: 'underline' }}>+34 636 239 696</span> o utilizando nuestro chat de soporte si tiene preguntas o cualquier cuestión.
            </p>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Devolucion;

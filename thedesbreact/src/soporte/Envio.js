import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Envio = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content py-5">
        <Container>
          <h1 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Envíos y Seguimineto
          </h1>
          
          {/* Política de envíos */}
          <div className="mx-auto" style={{ maxWidth: '800px', textAlign: 'justify', lineHeight: '1.8' }}>
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Política de Envíos</h2>
            <p>
              En TheDESB, nos comprometemos a ofrecer un proceso de envío eficiente y transparente para nuestros clientes en España y la Unión Europea. A continuación, encontrará información sobre nuestras políticas de envío.
            </p>
            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Tarifas y Estimaciones de Envío</h3>
            <p>
              Ofrecemos tarifas de envío estándar para pedidos dentro de España y la Unión Europea. Los costos de envío se calcularán en función del peso del pedido y la ubicación de entrega y se mostrarán al finalizar la compra. En algunos casos, ofrecemos envío gratuito en pedidos que superen un importe determinado, que se indicará claramente en el proceso de compra.
            </p>
            <p>
              Para asegurar la entrega oportuna, los pedidos suelen ser procesados y enviados en un plazo de 1-3 días hábiles. Los tiempos de entrega estimados dependerán del destino y del método de envío seleccionado.
            </p>
            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>¿Cómo puedo comprobar el estado de mi pedido?</h3>
            <p>
              Una vez que su pedido haya sido enviado, recibirá un correo electrónico con un número de seguimiento que le permitirá verificar el estado de su envío. Los tiempos de actualización de seguimiento pueden variar y pueden tardar hasta 24 horas en estar disponibles.
            </p>
            <p>
              Si no recibe su pedido dentro del plazo estimado, por favor contáctenos en <a href="mailto:thedesborigin@gmail.com" style={{ color: 'blue', textDecoration: 'underline' }}>thedesborigin@gmail.com</a> con su nombre y número de pedido para que podamos ayudarle a resolver cualquier problema.
            </p>

            {/* Política de devoluciones y garantía */}
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Política de Devoluciones y Garantía</h2>
            <p>
              Según la legislación española, tiene derecho a desistir de su compra en un plazo de 14 días naturales desde la recepción del producto sin necesidad de justificar su decisión. Este derecho se aplica a la mayoría de los productos, excepto aquellos que estén excluidos por ley, como productos personalizados o que se hayan desprecintado por razones de protección de salud o higiene.
            </p>
            <p>
              <strong>Proceso de devolución:</strong>
              <br />
              • Para ejercer su derecho de desistimiento, el producto debe estar en perfecto estado y en su embalaje original.
              <br />
              • Los gastos de devolución correrán a cargo del cliente, salvo en casos de error por nuestra parte o productos defectuosos.
              <br />
              • Para iniciar una devolución, contáctenos en <a href="mailto:thedesborigin@gmail.com" style={{ color: 'blue', textDecoration: 'underline' }}>thedesborigin@gmail.com</a>. Le proporcionaremos las instrucciones necesarias para devolver el producto.
            </p>
            <p>
              Una vez que recibamos el producto devuelto, le reembolsaremos el importe total pagado en un plazo de 14 días. Este reembolso incluirá el coste del producto, pero no los gastos de envío originales.
            </p>
            <p>
              <strong>Garantía:</strong>
              <br />
              Todos nuestros productos de segunda mano cuentan con una garantía legal de 1 año, conforme a la normativa española. Durante este periodo, podrá solicitar reparación, sustitución o reembolso si el producto presenta un defecto de origen.
            </p>
            <p>
              Además, ofrecemos una garantía comercial adicional de 60 días para devoluciones por cualquier motivo, proporcionando una mayor tranquilidad.
            </p>
            <p>
              Si el producto llega dañado o defectuoso, por favor contáctenos en <a href="mailto:thedesborigin@gmail.com" style={{ color: 'blue', textDecoration: 'underline' }}>thedesborigin@gmail.com</a> con su número de pedido y una foto del daño. Evaluaremos cada caso y buscaremos una solución adecuada.
            </p>
            <p>
              Para cualquier pregunta adicional, no dude en contactarnos mediante el correo electrónico <a href="mailto:thedesborigin@gmail.com" style={{ color: 'blue', textDecoration: 'underline' }}>thedesborigin@gmail.com</a> o llamando al número <a href="tel:+34636239696" style={{ color: 'blue', textDecoration: 'underline' }}>+34 636 239 696</a>. También puede utilizar nuestro chat de soporte para asistencia inmediata.
            </p>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Envio;

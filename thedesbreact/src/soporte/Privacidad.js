import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';

const Privacidad = () => {
  return (
    <div id="root">
      <Navbar />
      <div className="content py-5">
        <Container>
          <h1 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Política de Privacidad
          </h1>
          
          {/* Política de Privacidad */}
          <div className="mx-auto" style={{ maxWidth: '800px', textAlign: 'justify', lineHeight: '1.8' }}>
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Política de Privacidad</h2>
            <p>
              Esta Política de Privacidad describe cómo The DEBS (el “Sitio” o “nosotros”) recopila, usa y divulga su información personal cuando visita o realiza una compra en el Sitio.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Recopilación de Información Personal</h3>
            <p>
              Cuando visita el Sitio, recopilamos cierta información sobre su dispositivo, su interacción con el Sitio e información necesaria para procesar sus compras. También podemos recopilar información adicional si se comunica con nosotros para obtener asistencia al cliente. En esta Política de Privacidad, nos referimos a cualquier información que pueda identificar de forma única a una persona (incluida la información que se incluye a continuación) como "Información Personal". Consulte la lista a continuación para obtener más información sobre qué Información Personal recopilamos y por qué.
            </p>
            <h4 className="mb-3" style={{ fontWeight: 'bold' }}>Información del Dispositivo</h4>
            <p>
              Ejemplos de Información Personal Recopilada: versión del navegador web, dirección IP, zona horaria, información de cookies, qué sitios o productos visita, términos de búsqueda y cómo interactúa con el Sitio.
            </p>
            <p>
              Finalidad de la Recogida: para cargar el Sitio con precisión para usted y realizar análisis sobre el uso del Sitio para optimizarlo.
            </p>
            <p>
              Fuente de la Colección: se recopilan automáticamente cuando accede a nuestro Sitio mediante cookies, archivos de registro, balizas web, etiquetas o píxeles.
            </p>
            <p>
              Divulgación con Fines Comerciales: gestionado y procesado internamente por el equipo de The DEBS bajo la supervisión de Julio Bielsa.
            </p>

            <h4 className="mb-3" style={{ fontWeight: 'bold' }}>Información del Pedido</h4>
            <p>
              Ejemplos de Información Personal Recopilada: nombre, dirección de facturación, dirección de envío, información de pago (incluidos números de tarjeta de crédito, dirección de correo electrónico y número de teléfono).
            </p>
            <p>
              Finalidad de la Recogida: para proporcionarle productos o servicios para cumplir nuestro contrato, procesar su información de pago, organizar el envío y proporcionarle facturas y/o confirmaciones de pedidos, comunicarnos con usted, examinar nuestros pedidos para detectar posibles riesgos o fraudes y, cuando esté en línea con las preferencias que haya compartido con nosotros, brindarle información o publicidad relacionada con nuestros productos o servicios.
            </p>
            <p>
              Fuente de la Colección: recogido de usted.
            </p>
            <p>
              Divulgación con Fines Comerciales: gestionado y procesado internamente por el equipo de The DEBS bajo la supervisión de Julio Bielsa.
            </p>

            <h4 className="mb-3" style={{ fontWeight: 'bold' }}>Información de Atención al Cliente</h4>
            <p>
              Ejemplos de Información Personal Recopilada: nombre, dirección de facturación, dirección de envío, información de pago (incluidos números de tarjeta de crédito, dirección de correo electrónico y número de teléfono).
            </p>
            <p>
              Finalidad de la Recogida: para brindar soporte al cliente.
            </p>
            <p>
              Fuente de la Colección: recogido de usted.
            </p>
            <p>
              Divulgación con Fines Comerciales: gestionado y procesado internamente por el equipo de The DEBS bajo la supervisión de Julio Bielsa.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Menores de Edad</h3>
            <p>
              El Sitio no está destinado a personas menores de 14 años en caso de en España, la Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales (LOPDGDD) y menor de 13 años en el caso En la Unión Europea, el Reglamento General de Protección de Datos (GDPR) . No recopilamos intencionalmente información personal de niños. Si usted es el padre o tutor y cree que su hijo nos ha proporcionado información personal, comuníquese con nosotros a la siguiente dirección para solicitar la eliminación.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Compartir Información Personal</h3>
            <p>
              Su información personal es gestionada y procesada exclusivamente por The DEBS bajo la supervisión de Julio Bielsa, sin intervención de terceros. No compartimos su información con proveedores externos, salvo en los casos necesarios para cumplir con nuestras obligaciones legales o para proteger nuestros derechos. Por ejemplo, podríamos compartir su información personal para cumplir con las leyes y regulaciones aplicables, para responder a una citación, orden judicial u otra solicitud legal de información que recibamos.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Publicidad Conductual</h3>
            <p>
              Utilizamos su información personal para ofrecerle anuncios publicitarios y comunicaciones de marketing personalizadas que creemos que pueden ser de su interés. La información que recopilamos se ajusta y actualiza en función de sus preferencias y elecciones. Esto significa que la publicidad que verá en nuestro Sitio y en otros sitios web se personaliza para alinearse con sus intereses.
            </p>
            
            <p>
              Por ejemplo, empleamos herramientas de análisis como Google Analytics para entender cómo nuestros clientes interactúan con el Sitio. Puede obtener más información sobre cómo Google utiliza su información personal en su Política de Privacidad. También tiene la opción de desactivar Google Analytics.
            </p>

            <p>
              Compartimos información sobre su uso del Sitio, sus compras y su interacción con nuestros anuncios en otros sitios web con nuestros socios publicitarios. Esta información se recopila y actualiza continuamente para ofrecerle anuncios dirigidos que coincidan con sus preferencias, mediante cookies y otras tecnologías similares.
            </p>
            <p>
              Para comprender mejor cómo funciona la publicidad dirigida, le invitamos a visitar la página educativa de la{' '}
               <a href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work" target="_blank" rel="noopener noreferrer" style={{ color: '#e44604', textDecoration: 'underline' }}>
                  Network Advertising Initiative (NAI)
              </a>.
            </p>            
            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Uso de Información Personal</h3>
            <p>
              Utilizamos su información personal para brindarle nuestros servicios, lo que incluye: ofrecer productos para la venta, procesar pagos, enviar y cumplir con su pedido, y mantenerlo actualizado sobre nuevos productos, servicios y ofertas.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Base Legal</h3>
            <p>
              De conformidad con el Reglamento General de Protección de Datos (“RGPD”) y la Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales (“LOPDGDD”), procesamos su información personal conforme a las siguientes bases legales:
            </p>
            <ul>
              <li>Su consentimiento;</li>
              <li>La ejecución del contrato entre usted y el Sitio;</li>
              <li>Cumplimiento de nuestras obligaciones legales;</li>
              <li>Para proteger sus intereses vitales;</li>
              <li>Para realizar una tarea realizada en interés público;</li>
              <li>Por nuestros intereses legítimos, que no prevalecen sobre sus derechos y libertades fundamentales.</li>
            </ul>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Retención</h3>
            <p>
              Cuando realice un pedido a través del Sitio, conservaremos su información personal para nuestros registros a menos que nos solicite que borremos dicha información. Para obtener más información sobre su derecho de eliminación, consulte la sección "Sus Derechos" a continuación.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Toma de Decisiones Automática</h3>
            <p>
              Si usted es residente del EEE, tiene derecho a oponerse al procesamiento basado únicamente en la toma de decisiones automatizada (que incluye la elaboración de perfiles), cuando dicha toma de decisiones tenga un efecto legal sobre usted o lo afecte significativamente de otro modo.
            </p>
            <p>
              Nosotros NO HACEMOS participación en una toma de decisiones totalmente automatizada que tenga un efecto legal o significativo utilizando datos del cliente.
            </p>
            <p>
              Los servicios que incluyen elementos de toma de decisiones automatizada incluyen:
            </p>
            <ul>
              <li>Lista de direcciones IP rechazadas temporalmente asociadas con transacciones fallidas reiteradas. Esta lista de direcciones IP rechazadas persiste durante una pequeña cantidad de horas.</li>
              <li>Lista de denegación temporal de tarjetas de crédito asociadas a direcciones IP incluidas en la lista de denegaciones. Esta lista de denegaciones persiste durante una pequeña cantidad de días.</li>
            </ul>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Sus Derechos</h3>
            <p>
              Si usted es residente del EEE, tiene derecho a acceder a la información personal que tenemos sobre usted, a transferirla a un nuevo servicio y a solicitar que su información personal se corrija, actualice o elimine. Si desea ejercer estos derechos, comuníquese con nosotros a través de la siguiente dirección de contacto: <a href="mailto:thedesborigin@gmail.com" style={{ color: '#e44604', textDecoration: 'underline' }}>thedesborigin@gmail.com</a>.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Transferencias Internacionales</h3>
            <p>
              Su información personal se procesará inicialmente en España y luego se transferirá fuera de la Unión Europea para su almacenamiento y procesamiento. Estas transferencias se realizan en conformidad con las leyes y reglamentos aplicables.
            </p>

            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Registro</h3>
            <p>
              Cuando se registra en nuestro Sitio, se almacenará un registro en su dispositivo que nos permite identificar su cuenta y mantenerlo conectado. La información de su cuenta quedará registrada en nuestra base de datos, lo que facilita su acceso futuro y mejora su experiencia de usuario.
            </p>
            <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Cambios</h3>
            <p>
              Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar, por ejemplo, cambios en nuestras prácticas o por otras razones operativas, legales o reglamentarias. Cuando actualicemos esta Política de Privacidad, publicaremos la nueva versión en nuestro Sitio y actualizaremos la fecha de la "Última actualización" al final de esta Política de Privacidad. Le animamos a revisar periódicamente esta Política de Privacidad para estar informado sobre cómo estamos protegiendo su información.
            </p>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default Privacidad;

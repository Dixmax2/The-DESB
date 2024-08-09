import React from 'react';
import {Offcanvas} from 'react-bootstrap';



const Modales = ({ showCarro, handleCloseCarro,showLupa,handleCloseLupa}) => {

   
  if (showCarro) {
    return (
      <Offcanvas placement="end" show={showCarro} onHide={handleCloseCarro}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Carro</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Este es el carro
        </Offcanvas.Body>
      </Offcanvas>
    

    );

  }
 
  if (showLupa) {
    return (
        <Offcanvas placement="end" show={showLupa} onHide={handleCloseLupa}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Lupa</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Este es la Lupa
        </Offcanvas.Body>
      </Offcanvas>
    )
  };


  

}

export default Modales;
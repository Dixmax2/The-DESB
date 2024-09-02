import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Plus } from 'react-bootstrap-icons';
import '../css/productos.css'; // Asegúrate de incluir el archivo CSS para los estilos personalizados

const ProyectsCard = ({ productos, handleShow, handleEditProject, callModal, userRole }) => {
  return (
    <>
      <div className="row w-100 px-2 py-1">
        {productos.map((producto) => (
          <div className="col-xl-4 col-md-12 g-4" key={producto.id}>
            <Card className="h-100 w-100 mb-4 shadow-sm">
              {producto.miniatura ? (
                <Card.Img variant="top" src={`http://localhost:4000/projects/${producto.id}/${producto.miniatura}`} />
              ) : (
                <Card.Img variant="top" src="https://placehold.co/600x340?text=Photo+not+found"/>
              )}
              <Card.Body>
                <Card.Title>{producto.name}</Card.Title>
                <hr className="separator-line" />
                <Card.Text>
                  <strong>{producto.precio}€</strong>
                </Card.Text>
                <div className="d-flex flex-column justify-content-between align-items-center">
                  <div className="btn-group mb-auto" id='grupo'>
                    <Button href={`/proyect/${producto.id}`} variant="outline-primary" className="btn-sm">
                      <FontAwesomeIcon icon={faArrowUpFromBracket} /> Ver Producto
                    </Button>
                    {userRole === 'admin' && (
                      <>
                        <Button onClick={() => handleEditProject(producto)} variant="outline-secondary" className="btn-sm">
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </Button>
                        <Button onClick={() => callModal(producto)} variant="outline-danger" className="btn-sm">
                          <FontAwesomeIcon icon={faTrashCan} /> Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                  <br />
                  <small className="text-muted">{producto.fechaCreacion}</small>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {userRole === 'admin' && (
        <div className="col-xl-4 col-md-12 d-flex align-items-center justify-content-center g-4 p-2">
          <Button onClick={handleShow} variant="outline-primary" className="h-100 w-100" data-bs-toggle="modal" data-bs-target="#addProjectModal">
            <Plus size={30} />
          </Button>
        </div>
      )}
    </>
  );
};

export default ProyectsCard;

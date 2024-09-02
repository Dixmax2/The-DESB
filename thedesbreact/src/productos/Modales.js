import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import '../css/productos.css';

const Modales = ({ 
  show, 
  showEdit, 
  showDesh, 
  showArchi, 
  handleClose, 
  closeEdit, 
  closeArchi, 
  closeDesh, 
  ArchivarProyecto, 
  DesarchivarProyecto, 
  product, 
  fetchProductos, 
  setProductos 
}) => {
  const [formValid, setFormValid] = useState(false);

  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPrecio, setProyectPrecio] = useState("");
  const [projectTipo, setProyecTipo] = useState("");
  const [projectImageFile, setProjectImageFile] = useState("");
  const [projectCantidad, setProjectCantidad] = useState("");

  useEffect(() => {
    if (showEdit && product) {
      setProjectId(product.id || "");
      setProjectName(product.name || "");
      setProjectDescription(product.descripcion || "");
      setProyectPrecio(product.precio || "");
      setProyecTipo(product.tipo || "");
      setProjectImageFile(product.imageFile || "");
      setProjectCantidad(product.cantidad || "");
    }
  }, [showEdit, product]);

  useEffect(() => {
    const isFormValid = !!(projectName && projectImageFile && projectCantidad.length > 0);
    setFormValid(isFormValid);
  }, [projectName, projectImageFile, projectCantidad]);

  const addProject = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', projectName);
    formData.append('descripcion', projectDescription);
    formData.append('precio', projectPrecio);
    formData.append('tipo', projectTipo);
    formData.append('cantidad', projectCantidad);
    
    if (projectImageFile) {
      formData.append('imageFile', projectImageFile);
    }
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/add-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      fetchProductos(setProductos);
    } catch (error) {
      console.error("Error uploading the project: ", error.response);  
    }
  };

  const editProject = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('id', projectId);
    formData.append('name', projectName);
    formData.append('descripcion', projectDescription);
    formData.append('precio', projectPrecio);
    formData.append('tipo', projectTipo);
    formData.append('cantidad', projectCantidad);
    if (projectImageFile) {
      formData.append('imageFile', projectImageFile);
    }
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/edit-project`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProductos(setProductos);
      console.log("Proyecto editado");
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-product/${product.id}`);
      fetchProductos(setProductos); // Actualiza la lista de productos
      closeArchi(); // Cierra el modal
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };

  if (show) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="precio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                min="0"
                max="9999"
                onChange={(e) => setProyectPrecio(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                name="tipo"
                onChange={(e) => setProyecTipo(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Videojuego">Videojuego</option>
                <option value="Consola">Consola</option>
                <option value="Accesorio">Accesorio</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                min="0"
                max="9999"
                value={projectCantidad}
                onChange={(e) => setProjectCantidad(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>Miniatura</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                onChange={(e) => setProjectImageFile(e.target.files[0])}
                accept="image/png, image/jpg, image/jpeg"
              />
            </Form.Group>
            <Button
              onClick={(e) => {
                e.preventDefault();
                addProject(e);
                handleClose();
              }}
              type="submit"
              variant="primary"
              className="btn-black"
              disabled={!formValid}
            >
              Crear
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  if (showEdit) {
    return (
      <Modal show={showEdit} onHide={closeEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={product.name}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                defaultValue={product.descripcion}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="precio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                min="0"
                max="9999"
                defaultValue={product.precio}
                onChange={(e) => setProyectPrecio(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                name="tipo"
                defaultValue={product.tipo}
                onChange={(e) => setProyecTipo(e.target.value)}
              >
                <option value="Videojuego">Videojuego</option>
                <option value="Consola">Consola</option>
                <option value="Accesorio">Accesorio</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                min="0"
                max="9999"
                defaultValue={product.cantidad}
                onChange={(e) => setProjectCantidad(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>Miniatura</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                onChange={(e) => setProjectImageFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              editProject(e);
              closeEdit();
            }}
            type="submit"
            className="btn-black"
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (showArchi) {
    return (
      <Modal show={showArchi} onHide={closeArchi}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Si le da Aceptar, el contenido del producto <b>{product.name}</b> será eliminado de manera permanente.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-success"
            className="btn-sm"
            onClick={handleDeleteProduct} // Llama a la función de eliminación
          >
            Aceptar
          </Button>
          <Button
            variant="outline-danger"
            className="btn-sm"
            onClick={closeArchi} // Cierra el modal sin hacer nada más
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  

  return null;
}

export default Modales;

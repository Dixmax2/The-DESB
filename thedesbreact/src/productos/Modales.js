import React from 'react';
import { Button } from 'react-bootstrap';
import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const Modales = ({ show, showEdit,showDesh,showUser,showArchi, handleClose, closeEdit,closeUser,
  closeArchi,closeDesh,ArchivarProyecto,DesarchivarProyecto,product,fetchProductos,setProductos}) => {

    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const [formValid, setFormValid] = useState(false); // Estado para controlar la validez del formulario

    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectPrecio, setProyectPrecio] = useState("");
    const [projectTipo, setProyecTipo] = useState("");
    const [projectImageFile, setProjectImageFile] = useState("");
    //const [projectImageList, setProjectImageList] = useState([]);
    const [projectCantidad, setProjectCantidad] = useState("");

    useEffect(() => {
      if (showEdit && product) {
          setProjectId(product.id || "");
          setProjectName(product.name || "");
          setProjectDescription(product.descripcion || "");
          setProyectPrecio(product.precio || "");
          setProyecTipo(product.tipo || "");
          setProjectImageFile(product.imageFile || "");
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
      projectCantidad.forEach(file => {
        formData.append('ifcFiles', file); // Añadir cada archivo bajo el mismo nombre clave
      });
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

    useEffect(() => {
      // Método para obtener la lista de usuarios
      const fetchUsuarios = async () => {
        try {
          const response = await axios.get('http://localhost:4000/get-users'); // Ajusta la URL según tu API
          setUsuarios(response.data);
        } catch (error) {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      };
    
      // Llamar al método solo si el modal está visible
      if (showUser) {
        fetchUsuarios();
      }
    }, [showUser]);

    const handleCheckboxChange = (event) => {
      const { value, checked } = event.target;
      setSelectedUsuarios(prevSelectedUsuarios =>
        checked
          ? [...prevSelectedUsuarios, value]
          : prevSelectedUsuarios.filter(usuario => usuario !== value)
      );
    };



    const editProject = async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('id', projectId);
      formData.append('name', projectName);
      formData.append('descripcion', projectDescription);
      formData.append('precio', projectPrecio);
      formData.append('tipo', projectTipo);
      if (projectImageFile) {
        formData.append('imageFile', projectImageFile);
      }
      
      console.log(formData.data);
      try {
         await axios.put(`${process.env.REACT_APP_API_URL}/edit-project`, formData,  {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
             
         
      });
       

          fetchProductos(setProductos);
  
          // Mostrar un mensaje de éxito
          console.log("Proyecto editado");
      } catch (error) {
          console.error("Error editing project:", error);
      }
  };
  
  if (show) {

    return (

      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Crear proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                onChange={(e) => { setProjectName(e.target.value) }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                name="descripcion"
                onChange={(e) => { setProjectDescription(e.target.value) }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                min="0"
                max="9999"
                onChange={(e) => { setProyectPrecio(e.target.value) }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                required
                type="text"
                name="tipo"
                onChange={(e) => { setProyecTipo(e.target.value) }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                min="0"
                max="9999"
                onChange={(e) => setProjectCantidad([...e.target.value])}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Miniatura</Form.Label>
              <Form.Control
                type="file"
                name="urlImage"
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
            type='submit'
            variant="primary"
            disabled={!formValid} // Deshabilita el botón si el formulario no es válido
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
          <Modal.Title>Editar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre del proyecto</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={product.name}
                onChange={(e) => setProjectName(e.target.value)}
             
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                name="descripcion"
                defaultValue={product.descripcion}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Latitud</Form.Label>
              <Form.Control
                type="text"
                name="precio"
                min="-90"
                max="90"
                step="0.000001" // Define el incremento mínimo para la latitud 
                defaultValue={product.precio}
                onChange={(e) => { setProyectPrecio(e.target.value) }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>tipo</Form.Label>
              <Form.Control
                type="text"
                name="tipo"
                min="-180"
                max="180"
                step="0.000001" // Define el incremento mínimo para la tipo
                defaultValue={product.tipo}
                onChange={(e) => { setProyecTipo(e.target.value) }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Miniatura</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                defaultValue={product.imageFile}
                onChange={(e) => setProjectImageFile(e.target.files[0])}

              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="primary"
           onClick={(e) => {
            e.preventDefault();
            editProject(e);
            closeEdit();
            
          }}
          type='submit'
          
           >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

    );
  };


  if (showUser) {

    return (
      <Modal show={showUser} onHide={closeUser}>
      <Modal.Header closeButton>
        <Modal.Title>Usuarios del proyecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="usuariosCheckList">
            {usuarios.map(usuario => (
              <Form.Check
                key={usuario.id} // Asegúrate de tener una clave única para cada usuario
                type="checkbox"
                label={usuario.email}
                value={usuario.id} // O cualquier valor único que prefieras
                name="usuarios"
                checked={selectedUsuarios.includes(usuario.id)}
                onChange={handleCheckboxChange}
                required
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
    );
  };

  if (showArchi) {

    return (
      <Modal show={showArchi} onHide={closeArchi}>
        <Modal.Header closeButton>
          <Modal.Title>Archivar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>Si le da Aceptar el contenido del proyecto <b>{product.name}</b> será archivado de manera permanente</Modal.Body>
        <Modal.Footer>
        <Button variant="outline-success" className="btn-sm" onClick={() => {ArchivarProyecto(product.id); closeArchi();}}>
            Aceptar
          </Button>
          <Button variant="outline-danger" className="btn-sm" onClick={closeArchi}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

    );
  };                  

  if (showDesh) {

    return (
      <Modal show={showDesh} onHide={() => {closeDesh(); window.location.reload();}}>
        <Modal.Header closeButton>
          <Modal.Title>Desarchivar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>Si le da Aceptar el contenido del proyecto <b>{product.name}</b> será desarchivado de manera permanente</Modal.Body>
        <Modal.Footer>
        <Button variant="outline-success" className="btn-sm" onClick={() => {DesarchivarProyecto(product.id); closeDesh(); }}>
            Aceptar
          </Button>
          <Button variant="outline-danger" className="btn-sm" onClick={() => {closeDesh(); window.location.reload();}}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

    );
  };

}

export default Modales;
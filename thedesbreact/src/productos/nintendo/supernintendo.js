import React, { useState,useEffect } from 'react';
import { Col,Container,Row } from 'react-bootstrap';
import Navbar from '../../componentes/Navbar';
import Footer from '../../componentes/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileZipper, faFolder, faUsers } from '@fortawesome/free-solid-svg-icons';
import ProjectCard from '../ProyectsCard';
import Modales from '../Modales';
import Filter from '../Filter';
import PresentationCards from '../PresentationCards';
import axios from 'axios';

const fetchProductos = async (setProductos) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-productos`);
    setProductos(response.data);
  } catch (error) {
    console.error('Error fetching productos:', error);
  }
};

const Supernintendo = () => {

const [productos, setProductos] = useState([]);

const [product, setProduct] = useState([]);

const [show, setShow] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [showUser, setShowUser] = useState(false);
const [showArchi, setShowArchi] = useState(false);


const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const closeEdit = () => setShowEdit(false);
const handleShowEdit = () => setShowEdit(true);
const handleSetEdit = (product) => setProduct(product);

const handleShowUser = () => setShowUser(true);
const closeUser = () => setShowUser(false);

const handleShowArchi = () => setShowArchi(true)
const handleSetProject = (product) => setProduct(product);

useEffect(() => {
  // Llamar a fetchProductos cuando se monta el componente
  fetchProductos(setProductos);
  //fetchProjectsArchi(setProyectosArchi);
}, []);

function handleEditProject(product) {
  handleShowEdit(true);
  handleSetEdit(product);

};

function callModal(product) {
  handleShowArchi(true)
  handleSetProject(product)
}

  return (
    <div id="root">
      <Navbar />


      <Container fluid className="main-content">
        {/* Sección de presentación */}
        <PresentationCards />

        {/* Filtros y productos */}
        <Row>
          <Col md={3} className="filter-column">
            <Filter />
          </Col>

          <Col md={9}>
            <ProjectCard 
              productos={productos}
              handleShow={handleShow}
              handleEditProject={handleEditProject}
              handleShowUser={handleShowUser}
              handleShowArchi={handleShowArchi}
              handleSetProject={handleSetProject}
              callModal={callModal}
            />
          </Col>
        </Row>
      </Container>

      <Modales
            productos={productos}
            show={show}
            showEdit={showEdit}
            showUser={showUser}
            showArchi={showArchi}
            product={product}
            //showDesh={showDesh}


            setProductos={setProductos}
            //setProyectosArchi={setProyectosArchi}
            fetchProductos={fetchProductos}
            //fetchProjectsArchived={fetchProjectsArchi}
            handleClose={handleClose}
            closeEdit={closeEdit}
            closeUser={closeUser}
             
          />
  
      <Footer />
    </div>
  );
};

export default Supernintendo;

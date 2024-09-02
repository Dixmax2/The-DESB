import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Navbar from '../../componentes/Navbar';
import Footer from '../../componentes/Footer';
import ProjectCard from '../ProyectsCard';
import Modales from '../Modales';
import Filter from '../Filter';
import PresentationCards from '../PresentationCards';
import axios from 'axios';
import { useAppContext } from '../../contexto/UserContext';

// Función para obtener productos desde la API
const fetchProductos = async (setProductos) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-productos`);
    setProductos(response.data);
  } catch (error) {
    console.error('Error fetching productos:', error);
  }
};

// Componente principal
const Xbox360 = () => {
  const { state } = useAppContext(); // Obtener el estado del contexto
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [product, setProduct] = useState([]);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showArchi, setShowArchi] = useState(false);
  const [filters, setFilters] = useState({
    type: { Videojuego: false, Consola: false, Accesorio: false },
    price: { 'Menos de $20': false, '$20 - $50': false, 'Más de $50': false },
    availability: { 'En Stock': false, Agotado: false }
  });

  // Obtener el rol del usuario desde el contexto
  const userRole = state.role;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const closeEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleSetEdit = (product) => setProduct(product);

  const handleShowUser = () => setShowUser(true);
  const closeUser = () => setShowUser(false);

  const handleShowArchi = () => setShowArchi(true);
  const closeArchi = () => setShowArchi(false);
  const handleSetProject = (product) => setProduct(product);

  useEffect(() => {
    fetchProductos(setProductos);
  }, []);

  useEffect(() => {
    let filtered = productos;

    // Filtrado por tipo
    if (Object.values(filters.type).some(value => value)) {
      filtered = filtered.filter(product => filters.type[product.tipo]);
    }

    // Filtrado por precio
    if (Object.values(filters.price).some(value => value)) {
      filtered = filtered.filter(product => {
        const precio = parseFloat(product.precio);
        if (filters.price['Menos de $20'] && precio < 20) return true;
        if (filters.price['$20 - $50'] && precio >= 20 && precio <= 50) return true;
        if (filters.price['Más de $50'] && precio > 50) return true;
        return false;
      });
    }

    // Filtrado por disponibilidad
    if (Object.values(filters.availability).some(value => value)) {
      filtered = filtered.filter(product => {
        if (filters.availability['En Stock'] && product.cantidad > 0) return true;
        if (filters.availability.Agotado && product.cantidad <= 0) return true;
        return false;
      });
    }

    setFilteredProductos(filtered);
  }, [filters, productos]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleEditProject = (product) => {
    handleShowEdit();
    handleSetEdit(product);
  };

  const callModal = (product) => {
    handleShowArchi();
    handleSetProject(product);
  };

  return (
    <div id="root">
      <Navbar />

      <Container fluid className="main-content">
        {/* Sección de presentación */}
        <PresentationCards />

        {/* Filtros y productos */}
        <Row>
          <Col md={3} className="filter-column">
            <Filter onFilterChange={handleFilterChange} />
          </Col>

          <Col md={9}>
            <ProjectCard 
              productos={filteredProductos} // Utilizar los productos filtrados
              handleShow={handleShow}
              handleEditProject={handleEditProject}
              callModal={callModal}
              userRole={userRole} // Pasar el rol del usuario
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
        setProductos={setProductos}
        fetchProductos={fetchProductos}
        handleClose={handleClose}
        closeEdit={closeEdit}
        closeUser={closeUser}
        closeArchi={closeArchi}
      />
  
      <Footer />
    </div>
  );
};

export default Xbox360;

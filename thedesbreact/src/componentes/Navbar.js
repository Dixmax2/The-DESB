import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavDropdown, Nav, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img from '../assets/images/DESBtrans.png';
import { faUser, faMagnifyingGlass, faCartShopping, faUserSecret, faUserCog, faLock, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; // Añadimos faLock y faRightFromBracket
import Modales from './Modales';
import '../css/navbar.css';
import { useAppContext } from '../contexto/UserContext';

const Navbar = () => {
  const { state, dispatch } = useAppContext();
  const name = state.name;
  const role = state.role;

  const [showCarro, setShowCarro] = useState(false);
  const [showLupa, setShowLupa] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navigate = useNavigate();

  const handleCloseCarro = () => setShowCarro(false);
  const handleShowCarro = () => setShowCarro(true);

  const handleCloseLupa = () => setShowLupa(false);
  const handleShowLupa = () => setShowLupa(true);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const desconectarse = async () => {
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    dispatch({ type: 'SET_NAME', value: '' });
    navigate('/');
  };

  // Función para redirigir a diferentes páginas
  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Modales
            showCarro={showCarro}
            handleCloseCarro={handleCloseCarro}
            showLupa={showLupa}
            handleCloseLupa={handleCloseLupa}
          />
          <a className="navbar-brand" href="/">
            <img src={img} height="75" width="150" alt="DESB" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav navbar-nav-center">
              <li className="nav-item">
                <Nav.Link onClick={handleShowOffcanvas}>
                  <b>Productos</b>
                </Nav.Link>
              </li>
              <li className="nav-item">
                <Nav.Link href="/vender">
                  <b>Vender o Intercambiar</b>
                </Nav.Link>
              </li>
              <li className="nav-item">
                <NavDropdown title={<span><b>Compañía</b></span>} id="navbarScrollingDropdown">
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/nosotros">Nosotros</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/contact">Contáctanos</NavDropdown.Item>
                </NavDropdown>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Nav.Link title="Lupa" onClick={handleShowLupa}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Nav.Link>
              </li>
              {!name && (
                <li className="nav-item">
                  <Nav.Link title="User Anónimo" href="/login">
                    <FontAwesomeIcon icon={faUserSecret} />
                  </Nav.Link>
                </li>
              )}
              {name && (
                <NavDropdown
                  title={
                    <span style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <FontAwesomeIcon icon={role === 'admin' ? faUserCog : faUser} /> {name}
                    </span>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Divider />
                  {role === 'admin' && (
                    <NavDropdown.Item onClick={() => goToPage('/perfil')}>
                      <FontAwesomeIcon icon={faLock} className="me-1" /> Panel de Administración
                    </NavDropdown.Item>
                  )}
                  {role !== 'admin' && (
                    <NavDropdown.Item onClick={() => goToPage('/perfil')}>
                      <FontAwesomeIcon icon={faLock} className="me-1" /> Perfil
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item onClick={desconectarse}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="me-1" /> Desconectarse
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              <li className="nav-item">
                <Nav.Link title="Carro de compra" onClick={handleShowCarro}>
                  <FontAwesomeIcon icon={faCartShopping} />
                </Nav.Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement="top"
        className="offcanvas-top"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Productos</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="product-list">
            <div className="product">
              <h5>Nintendo</h5>
              <ul>
                <li>
                  <a href="/supernintendo">Super Nintendo</a>
                </li>
                <li>
                  <a href="/nintendo-3ds">Wii</a>
                </li>
                <li>
                  <a href="/nintendo-wii">3DS</a>
                </li>
              </ul>
            </div>
            <div className="product">
              <h5>PlayStation</h5>
              <ul>
                <li>
                  <a href="/ps1">PS2</a>
                </li>
                <li>
                  <a href="/ps2">PS3</a>
                </li>
                <li>
                  <a href="/ps4">PS4</a>
                </li>
              </ul>
            </div>
            <div className="product">
              <h5>Xbox</h5>
              <ul>
                <li>
                  <a href="/xbox-series-x">Original Xbox</a>
                </li>
                <li>
                  <a href="/xbox360">Xbox 360</a>
                </li>
                <li>
                  <a href="/xbox-one">Xbox One</a>
                </li>
              </ul>
            </div>
            <div className="product">
              <h5>Otros</h5>
              <ul>
                <li>
                  <a href="/ouya">Cables</a>
                </li>
                <li>
                  <a href="/atari">Cascos</a>
                </li>
                <li>
                  <a href="/commodore">Commodore</a>
                </li>
              </ul>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbar;

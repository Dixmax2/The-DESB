import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavDropdown, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img from '../assets/images/DESBtrans.png';
import { faUser, faMagnifyingGlass, faCartShopping, faUserSecret, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Modales from './Modales';
import '../css/navbar.css';
import { useAppContext } from '../contexto/UserContext';

const Navbar = () => {
  const { state, dispatch } = useAppContext();
  const name = state.name;
  const role = state.role;

  const [showCarro, setShowCarro] = useState(false);
  const [showLupa, setShowLupa] = useState(false);

  const handleCloseCarro = () => setShowCarro(false);
  const handleShowCarro = () => setShowCarro(true);

  const handleCloseLupa = () => setShowLupa(false);
  const handleShowLupa = () => setShowLupa(true);

  const navigate = useNavigate();

  const desconectarse = async () => {
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    dispatch({ type: 'SET_NAME', value: '' });
    navigate('/');
  };
console.log(name)
console.log(role)
console.log(state)

  return (
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
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav navbar-nav-center">
            <li className="nav-item">
              <Nav.Link href="#action2"><b>Productos</b></Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link href="/vender"><b>Vender o Intercambiar</b></Nav.Link>
            </li>
            <li className="nav-item">
              <NavDropdown
                title={<span><b>Compañía</b></span>}
                id="navbarScrollingDropdown"
              >
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
            { name && role === "" && (
              <NavDropdown 
                title={<span style={{ display: 'flex', alignItems: 'center', color:'white'}}>
                    <FontAwesomeIcon icon={faUser} className="fa-icon" /> {name}
                  </span>
                }
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Divider style={{ background:'white' }} />
                <NavDropdown.Item onClick={desconectarse} style={{ color:'white' }}>Desconectarse</NavDropdown.Item>
              </NavDropdown>
            )}
              {name && role === "admin"  &&  (
              <NavDropdown 
                title={
                  <span style={{ color: 'white', display: 'flex', alignItems: 'center' }}> 
                    <FontAwesomeIcon icon={faUserCog} style={{ color: 'white' }} /> {name}
                  </span>
                }
                id="navbarScrollingDropdownUser2"
              >
                <NavDropdown.Divider style={{ backgroundColor: 'white' }} />
                <NavDropdown.Item style={{ color: 'white' }} onClick={desconectarse}>Desconectarse</NavDropdown.Item>
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
  );
};

export default Navbar;

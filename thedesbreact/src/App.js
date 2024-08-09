import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Login from './componentes/Login';
import Register from './componentes/Register';
import PasswordRecover from './componentes/Password-recover';
import PasswordRecoverConfirm from './componentes/Password-recover-confirm';
import Nosotros from './views/Nosotros';
import Contact from './views/Contact';
import Vender from './views/Vender';
import './App.css';
import Envio from './soporte/Envio';
import Devolucion from './soporte/Devolucion';
import Terminos from './soporte/Terminos';
import Privacidad from './soporte/Privacidad';
import { useEffect } from 'react';
import { useAppContext } from './contexto/UserContext';

function App() {

  const { dispatch } = useAppContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/user-check', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const content = await response.json();
        // Actualiza el estado utilizando el contexto
        dispatch({ type: 'SET_NAME', value: content.name });
        dispatch({ type: 'SET_ROLE', value: content.role });
        console.log(content.name)
        console.log(content.role)
      } catch (error) {
        // Maneja los errores
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (

      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-recover" element={<PasswordRecover />} />
            <Route path="/password-recover-confirm" element={<PasswordRecoverConfirm />} />
            <Route path="/vender" element={<Vender />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/envio" element={<Envio />} />
            <Route path="/devolucion" element={<Devolucion />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
          </Routes>
        </BrowserRouter>
      </div>
   
   
  );
}

export default App;

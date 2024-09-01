// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Login from './componentes/Login';
import Register from './componentes/Register';
import PasswordRecover from './componentes/Password-recover';
import PasswordRecoverConfirm from './componentes/Password-recover-confirm';
import PanelAdministrador from './componentes/PanelAdministrador';
import InvitarUsuarios from './componentes/Invitar-usuarios';
import Nosotros from './views/Nosotros';
import Contact from './views/Contact';
import Vender from './views/Vender';
import './App.css';
import Envio from './soporte/Envio';
import Devolucion from './soporte/Devolucion';
import Terminos from './soporte/Terminos';
import Privacidad from './soporte/Privacidad';
import Supernintendo from './productos/nintendo/supernintendo';
import { useAppContext } from './contexto/UserContext';
import ChatButton from './componentes/ChatBoton'; // Importa el botón flotante
import Chat from './componentes/Chat'; // Importa el componente del chat

function App() {
  const { dispatch, state } = useAppContext(); // Asegúrate de obtener el estado del usuario
  const [showChat, setShowChat] = useState(false); // Estado para controlar la visibilidad del chat

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
        console.log(content.name);
        console.log(content.role);
      } catch (error) {
        // Maneja los errores
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  // Función para manejar la apertura y cierre del chat
  const handleChatOpen = () => setShowChat(true);
  const handleChatClose = () => setShowChat(false);
console.log(state.user)
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-recover" element={<PasswordRecover />} />
          <Route path="/password-recover-confirm" element={<PasswordRecoverConfirm />} />
          <Route path="/perfil" element={<PanelAdministrador />} />
          <Route path="/invitar-usuarios" element={<InvitarUsuarios />} />
          <Route path="/vender" element={<Vender />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/envio" element={<Envio />} />
          <Route path="/devolucion" element={<Devolucion />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/supernintendo" element={<Supernintendo />} />
        </Routes>
      {/* Botón flotante de chat */}
      <ChatButton onClick={handleChatOpen} />

      {/* Componente de chat */}
      
      <Chat show={showChat} handleClose={handleChatClose} icon="chat" user={state.user} />
      </BrowserRouter>
    </div>
  );
}

export default App;

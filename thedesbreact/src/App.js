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
import Envio from './soporte/Envio';
import Devolucion from './soporte/Devolucion';
import Terminos from './soporte/Terminos';
import Privacidad from './soporte/Privacidad';
import Supernintendo from './productos/nintendo/supernintendo';
import Wii from './productos/nintendo/wii';
import Producto from './productos/Producto';
import SearchResults from './componentes/SearchResults'; // Importa tu nuevo componente de búsqueda
import { useAppContext } from './contexto/UserContext';
import ChatButton from './componentes/ChatBoton';
import Chat from './componentes/Chat';
import Checkout from './componentes/Checkout';
import Ds from './productos/nintendo/3ds';
import Ps2 from './productos/playstation/ps2';
import Ps3 from './productos/playstation/ps3';
import Ps4 from './productos/playstation/ps4';
import Origin from './productos/xbox/originalxbox';
import Xbox360 from './productos/xbox/xbox360';
import One from './productos/xbox/xboxone';
function App() {
  const { dispatch, state } = useAppContext();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/user-check', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const content = await response.json();
        dispatch({ type: 'SET_NAME', value: content.name });
        dispatch({ type: 'SET_ROLE', value: content.role });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const handleChatOpen = () => setShowChat(true);
  const handleChatClose = () => setShowChat(false);

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
          <Route path="/nintendo-3ds" element={<Ds />} />
          <Route path="/nintendo-wii" element={<Wii/>} />
          <Route path="/ps1" element={<Ps2 />} />
          <Route path="/ps2" element={<Ps3 />} />
          <Route path="/ps4" element={<Ps4 />} />
          <Route path="/xbox-series-x" element={<Origin />} />
          <Route path="/xbox360" element={<Xbox360 />} />
          <Route path="/xbox-one" element={<One />} />
          <Route path="/proyect/:id" element={<Producto />} /> 
          <Route path="/search" element={<SearchResults />} /> 
          <Route path="/checkout" element={<Checkout />} /> 
        </Routes>
        <ChatButton onClick={handleChatOpen} />
        <Chat show={showChat} handleClose={handleChatClose} icon="chat" user={state.user} />
      </BrowserRouter>
    </div>
  );
}

export default App;

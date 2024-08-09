import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img from "../assets/images/DESBnegativo.png";
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import { useAppContext } from '../contexto/UserContext';

const Login = () => {
  const { dispatch } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email: email,
        password: password,
      }, {
        withCredentials: true
      });
     
      const userData = response.data; // Suponiendo que la respuesta contenga los datos del usuario
      dispatch({ type: 'SET_NAME', value: userData.name });
      dispatch({ type: 'SET_EMAIL', value: userData.email });
      dispatch({ type: 'SET_ROLE', value: userData.role });
      // Puedes despachar otras acciones si es necesario para establecer otros estados

      navigate('/');
    } catch (err) {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <Container fluid className="m-0 p-0 ">
      <Navbar />
      <section className="h-100 gradient-form" style={{ backgroundColor: "#eee" }}>
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center pt-3 pb-5">
                      <img src={img} height="175" width="350" alt="DESB" />
                      <h2>Login</h2>
                    </div>
                    <Form onSubmit={submitData}>
                      <Form.Floating className="mb-3">
                        <Form.Control type="email" id="email" placeholder="name@example.com" onChange={e => { setEmail(e.target.value) }} required />
                        <label htmlFor="email">Correo electrónico</label>
                      </Form.Floating>
                      <Form.Floating className="mb-3">
                        <Form.Control type="password" id="password" placeholder="Password" onChange={e => { setPassword(e.target.value) }} required />
                        <label htmlFor="password">Contraseña</label>
                      </Form.Floating>
                      <div className="row justify-content-center pointer my-2">
                        <Link to={"/password-recover"} style={{ textDecoration: 'none', color: 'black' }}>
                          <small className="text-muted user-select-none pe-auto" id='olvidascontraseña'>¿Olvidaste la contraseña?</small>
                        </Link>
                      </div>
                      <div className="row justify-content-center my-3 px-3">
                        <Button type="submit" style={{ background: 'black' }} className="btn-block btn btn-primary btn-color">Iniciar sesión</Button>
                      </div>
                      <div className="row justify-content-center pointer my-2">
                        <Link to={"/register"} style={{ textDecoration: 'none', color: 'black' }}>
                          <small id='pararegistrar' className="text-muted user-select-none pe-auto">¿Todavía no te has Registrado?</small>
                        </Link>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer theme="colored" position="bottom-right" hideProgressBar closeOnClick />
      <Footer />
    </Container>
  );
};

export default Login;

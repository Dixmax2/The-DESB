import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import img from "../assets/images/DESBnegativo.png";
import axios from 'axios';
import { Link } from 'react-router-dom';

const PasswordRecoverConfirm = () => {
    const [password, setPassword] = useState('');
    const [passwordconfirm, setPasswordConfirm] = useState('');
    const [token, setToken] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el token de la URL
        const searchParams = new URLSearchParams(location.search);
        const tokenFromURL = searchParams.get('token');
        if (tokenFromURL) {
            setToken(tokenFromURL);
        }
    }, [location]);

    const handleSubmit = async (e) => {
            try {
                // Petición POST a la API
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/password-recover-confirm`, {
                    token: token,
                    password: password,
                    passwordconfirm: passwordconfirm
                }, {
                  withCredentials: true
                });
                // Mensaje de alerta
                toast.success(response.data.message);
                
            } catch (err) {
                toast.error(err.response.data.message);
            }
      };

    // Función para comprobar que las contraseñas coinciden
    const checkPassword = (e) => {
        e.preventDefault();
        if (password === passwordconfirm) {
            handleSubmit(e); // Si las contraseñas coinciden, se envía la petición
        } else {
            toast.error('Las contraseñas no coinciden');
        }
    };

    return (
        <Container fluid className="m-0 p-0">
            <Navbar />
            <section className="h-100 gradient-form" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-xl-10">
                            <div className="card rounded-3 text-black">
                                <div className="row g-0">
                                    {/* col del formulario */}
                                    <div className="card-body p-md-5 mx-md-4">
                                        {/* logo */}
                                        <div className="text-center pt-3 pb-5">
                                            <img src={img} height="175" width="350" alt="DESB" />
                                            <h2>Cambiar contraseña</h2>
                                        </div>
                                        {/* Formulario */}
                                        <Form onSubmit={checkPassword}>
                                            <div className="row justify-content-center my-2">
                                                <div className=" p-3">Introduce la nueva contraseña</div>
                                            </div>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    id="password"
                                                    placeholder="Nueva contraseña"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="password">Nueva contraseña</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    id="passwordconfirm"
                                                    placeholder="Confirma la nueva contraseña"
                                                    value={passwordconfirm}
                                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="passwordconfirm">Confirma la nueva contraseña</label>
                                            </Form.Floating>
                                            <div className="row justify-content-center my-3 px-3">
                                                <Button type="submit" className="btn-block btn btn-primary btn-color">Cambiar contraseña</Button>
                                            </div>
                                            <div className="row justify-content-center pointer my-2">
                                                <Link to={"/login"} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <small className="text-muted user-select-none pe-auto">Volver a inicio de sesión</small>
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
            {/* Configuracion de libreria de mensajes de alerta */}
            <ToastContainer
                theme="colored"
                position="bottom-right"
                hideProgressBar
                closeOnClick
            />
            <Footer />
        </Container>
    );
};

export default PasswordRecoverConfirm;

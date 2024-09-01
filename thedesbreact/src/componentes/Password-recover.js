import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../componentes/Navbar';
import img from "../assets/images/DESBnegativo.png";
import Footer from '../componentes/Footer';
import axios from 'axios';
import '../css/Login.css'; 

const PasswordRecover = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Petición POST a la API
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/password-recover`, {
                email: email
            }, {
                withCredentials: true
            });
            console.log("success login");

            // Mensaje de alerta
            toast.success(response.data.message);
        } catch (err) {
            toast.error(err.response.data.message);
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
                                    {/* Columna del formulario */}
                                    <div className="card-body p-md-5 mx-md-4">
                                        {/* Logo */}
                                        <div className="text-center pt-3 pb-5">
                                            <img src={img} height="175" width="350" alt="DESB" />
                                            <h2>Recuperar contraseña</h2>
                                        </div>
                                        {/* Formulario */}
                                        <Form onSubmit={handleSubmit}>
                                            <div className="py-3">
                                                Introduce tu correo y te enviaremos un e-mail para recuperar tu contraseña.
                                            </div>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="email"
                                                    id="email"
                                                    placeholder="name@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="email">Correo</label>
                                            </Form.Floating>
                                            <div className="row justify-content-center my-3 px-3">
                                                <Button type="submit" className="btn-color btn-block btn btn-primary">Recuperar contraseña</Button>
                                            </div>
                                            <div className="row justify-content-center my-2">
                                                <Link to={"/login"} className="link-color">
                                                    <small>Volver a inicio de sesión</small>
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

export default PasswordRecover;

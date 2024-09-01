import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img from "../assets/images/DESBnegativo.png";
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import '../css/Login.css'; 

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Petición POST a la API para registrar un nuevo usuario
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
                name: name,
                email: email,
                password: password
            });

            // Manejar la respuesta de la API
            console.log(response.data); // Maneja la respuesta de acuerdo a tu lógica de la aplicación

            // Limpiar los campos después del registro exitoso
            setName('');
            setEmail('');
            setPassword('');

            // Mensaje de éxito
            toast.success('Registro exitoso');
        } catch (error) {
            console.error('Error al registrar:', error);
            // Manejar el error, mostrar un mensaje de error, etc.
            toast.error('Error al registrar, por favor inténtalo de nuevo');
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
                                        {/* Logo y Título */}
                                        <div className="text-center pt-3 pb-5">
                                            <h1>Registrarte para entrar a la familia</h1>
                                            <img src={img} height="175" width="350" alt="DESB" />
                                            <h2>Registrarse</h2>
                                        </div>
                                        {/* Formulario */}
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    id="name"
                                                    placeholder="Nombre"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="name">Nombre</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="email"
                                                    id="email"
                                                    placeholder="name@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="email">Correo electrónico</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    id="password"
                                                    placeholder="Contraseña"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="password">Contraseña</label>
                                            </Form.Floating>
                                            <div className="row justify-content-center my-3 px-3">
                                                <Button type="submit" className="register-button btn-block btn btn-primary btn-color">Registrarse</Button>
                                            </div>
                                            <div className="row justify-content-center my-2">
                                                <Link to={"/login"} className="register-link">
                                                    <small id="pararegistrar">¿Ya tienes una cuenta? Inicia sesión aquí</small>
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

export default Register;

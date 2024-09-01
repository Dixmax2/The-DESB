import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Alert, Image } from 'react-bootstrap'
//import logoImg from '../assets/images/levitec-viewerifc.png'  <img src={logoImg} style={{ width: "205px" }} alt="logo" />
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvitarUsuarios = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [nombre, setNombre] = useState("")
    const [token, setToken] = useState('');
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        // Obtener el token de la URL
        const searchParams = new URLSearchParams(location.search);
        const tokenFromURL = searchParams.get('token');
        if (tokenFromURL) {
            setToken(tokenFromURL);
        }
    }, [location]);

    const InvitarUsuario = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/registrar-usuario-invitado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    password: password,
                    nombre: nombre
                })
            })
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    function checkPassword(e) {
        e.preventDefault()

        if (password === confirmPassword) {
            InvitarUsuario()
        } else {
            toast.error("Las contraseñas no coinciden");
        }
    }

    return (
        <Container fluid className="m-0 p-0 vh-100 vw-100">
            <section className="h-100 gradient-form" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-xl-10">
                            <div className="card rounded-3 text-black">
                                <div className="row g-0">

                                    {/* col del formulario */}
                                    <div className="col-lg-6">
                                        <div className="card-body p-md-5 mx-md-4">

                                            {/* logo */}
                                            <div className="text-center pt-3 pb-5">
                                                
                                            </div>

                                            {/* Formulario */}
                                            <Form onSubmit={checkPassword}>
                                                <div className="row justify-content-center my-2">
                                                    <div className=" p-3">Rellena los siguientes campos para registrarse</div>
                                                </div>
                                                <Form.Floating className="mb-3">
                                                    <Form.Control type="text" id="nombre" placeholder="Nombre" onChange={e => { setNombre(e.target.value) }} required />
                                                    <label htmlFor="nombre">Nombre</label>
                                                </Form.Floating>
                                                <Form.Floating className="mb-3">
                                                    <Form.Control type="password" id="password" placeholder="Nueva contraseña" onChange={e => { setPassword(e.target.value) }} required />
                                                    <label htmlFor="password">Contraseña</label>
                                                </Form.Floating>
                                                <Form.Floating className="mb-3">
                                                    <Form.Control type="password" id="passwordConfirm" placeholder="confirmar contraseña" onChange={e => { setConfirmPassword(e.target.value) }} required />
                                                    <label htmlFor="passwordConfirm">Confirmar contraseña</label>
                                                </Form.Floating>

                                                <div className="row justify-content-center my-3 px-3">
                                                    <Button type="submit" className="btn-block btn btn-primary btn-color">Registrar</Button>
                                                </div>

                                            </Form>

                                        </div>
                                    </div>

                                    {/* col de imagen de fondo */}
                                    <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                        <div className="text-white px-3 py-4 p-md-5 mx-md-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Configuracion de libreria de mensajes de alerta */}
                <ToastContainer
                    theme="colored"
                    position="bottom-right"
                    hideProgressBar
                    closeOnClick
                />
            </section>
        </Container>
    )

}

export default InvitarUsuarios
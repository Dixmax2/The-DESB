import { faArrowRight, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, Offcanvas } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chat({ show, handleClose, icon, user }) {
    const navigate = useNavigate();
    const { id: projectId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [roomID] = useState(projectId);
    const [image, setImage] = useState(null);

    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!show) return;  // No hacer nada si el chat no está visible

        if (user === undefined) {  // Si user es undefined, no abrir la pestaña del chat
            toast.warn('Por favor, inicie sesión para acceder al chat.');
            navigate('/login');

            // Verificar que 'handleClose' sea una función antes de llamarla
            if (typeof handleClose === 'function') {
                handleClose();  // Cierra la pestaña de chat
            }
            return;  // Detener la ejecución aquí
        }

        // Verificar si el usuario tiene el rol adecuado
        if (user.role !== 'user' && user.role !== 'admin') {
            toast.warn('Por favor, inicie sesión como usuario o administrador para acceder al chat.');
            navigate('/login');

            if (typeof handleClose === 'function') {
                handleClose();  // Cierra la pestaña de chat
            }
            return;
        }

        // Si el usuario está autenticado y tiene el rol adecuado, establecer la conexión WebSocket
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:4000/getMessages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectID: projectId })
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error('Expected an array of messages, but got:', data);
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            }
        };

        fetchMessages();

        const socketInstance = new WebSocket('ws://localhost:4000/ws');
        socket.current = socketInstance;

        socketInstance.onopen = () => {
            console.log('WebSocket connected');
            socketInstance.send(JSON.stringify({ room_id: roomID }));
        };

        socketInstance.onmessage = event => {
            const message = JSON.parse(event.data);
            if (message.room_id === roomID) {
                setMessages(prevMessages => (prevMessages ? [...prevMessages, message] : [message]));
            }
        };

        socketInstance.onclose = () => {
            console.log('WebSocket disconnected');
        };

        socketInstance.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        return () => {
            socketInstance.close();
        };

    }, [show, user, roomID, projectId, navigate, handleClose]); // Dependencias necesarias

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    }, [show]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() !== '' || image !== null) {
            let imageBase64 = null;
            let imageName = null;
            if (image) {
                imageBase64 = await convertToBase64(image);
                imageName = image.name;
            }

            const message = {
                sender: user.email,
                user_id: user.Id,
                avatar: user.avatar,
                content: input,
                room_id: roomID,
                Created_at: new Date().toISOString(),
                image: imageBase64,
                imageName: imageName
            };

            socket.current.send(JSON.stringify(message));
            setInput('');
            setImage(null);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    };

    if (icon === "chat") {
        return (
            <>
                <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "500px", userSelect: "text" }}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Chat</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="d-flex flex-column" style={{ height: '100vh', userSelect: "text" }}>
                        <div className="flex-grow-1 overflow-auto">
                            {Array.isArray(messages) && messages.map((message, index) => (
                                <React.Fragment key={index}>
                                    {message.sender !== user.email ? (
                                        <>
                                            <div className="d-flex justify-content-between mx-1">
                                                <p className="small mb-0 mx-2">{message.sender}</p>
                                            </div>
                                            <div className="d-flex flex-row justify-content-start">
                                                {message.avatar ? (
                                                    <img src={`http://localhost:4000/users/${message.user_id}/${message.avatar}`} alt="avatar 1" style={{ width: "40px", height: "100%", borderRadius: "50%" }} />
                                                ) : (
                                                    <img src="http://localhost:4000/users/invitado.png" alt="avatar 1" style={{ width: "40px", height: "100%", borderRadius: "50%" }} />
                                                )}
                                                <div>
                                                    <div className="small p-2 ms-3 mb-2 rounded-3 mt-1" style={{ backgroundColor: "#e0e0e0" }}>
                                                        <div style={{ fontWeight: "bold" }}>
                                                            <div>{message.image && <img src={`http://localhost:4000/projects/${message.room_id}/messages/${message.image}`} alt="preview" style={{ width: '350px', height: '350px' }} />}</div>
                                                            <div>{message.content}</div>
                                                        </div>
                                                        <small>{formatDate(message.Created_at)}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="d-flex flex-row justify-content-end">
                                                <div>
                                                    <div className="small p-2 me-3 mb-2 rounded-3 mt-1 text-white" style={{ backgroundColor: "#007bff" }}>
                                                        <div style={{ fontWeight: "bold" }}>
                                                            <div>{message.image && <img src={`http://localhost:4000/projects/${message.room_id}/messages/${message.image}`} alt="preview" style={{ width: '350px', height: '350px' }} />}</div>
                                                            <div>{message.content}</div>
                                                        </div>
                                                        <small>{formatDate(message.Created_at)}</small>
                                                    </div>
                                                </div>
                                                {message.avatar ? (
                                                    <img src={`http://localhost:4000/users/${message.user_id}/${message.avatar}`} alt="avatar 2" style={{ width: "40px", height: "100%", borderRadius: "50%" }} />
                                                ) : (
                                                    <img src="http://localhost:4000/users/invitado.png" alt="avatar 2" style={{ width: "40px", height: "100%", borderRadius: "50%" }} />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <Form onSubmit={sendMessage} className="mt-auto">
                            <InputGroup className="mb-3">
                                <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                                <Button variant="outline-secondary" onClick={() => setImage(null)} disabled={!image}>Eliminar Imagen</Button>
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="Escribe tu mensaje..." value={input} onChange={(e) => setInput(e.target.value)} />
                                <Button variant="outline-primary" type="submit">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
                <ToastContainer />
            </>
        );
    } else {
        return null;
    }
}

export default Chat;

import { faCheck, faGear, faShield, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Dropdown, Table } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppContext } from '../contexto/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/PanelAdministrador.css'; // Asegúrate de importar tu archivo CSS

function PanelAdministrador() {
    const [view, setView] = useState(1);
    const { state, dispatch } = useAppContext();
    const [nombre, setNombre] = useState(state.name);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [users, setUsers] = useState([]);
    const [invitedUser, setInvitedUser] = useState('');

    const goToPage = (page) => {
        setView(page);
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get-users`);
                if (!response.ok) throw new Error('Error al obtener los usuarios');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                toast.error(`Error al obtener los usuarios: ${error.message}`);
            }
        };

        getUsers();

        setPasswordsMatch(newPass === confirmNewPass);
    }, [newPass, confirmNewPass]);

    const actualizarNombre = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/actualizar-nombre`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: state.Id,
                    name: nombre
                })
            });
            if (!response.ok) throw new Error('Error al actualizar el nombre');
            const data = await response.json();
            dispatch({ type: 'SET_NAME', value: nombre });
            toast.success(data.message);
        } catch (error) {
            toast.error(`Error al actualizar el nombre: ${error.message}`);
        }
    }

    const cambiarContraseña = async (e) => {
        e.preventDefault();
        if (newPass !== confirmNewPass) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cambiar-contrasena`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: state.Id,
                    oldPassword: oldPass,
                    newPassword: newPass,
                })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cambiar la contraseña');
            }
            const data = await response.json();
            toast.success(data.message);
        } catch (error) {
            toast.error(`Error al cambiar la contraseña: ${error.message}`);
        }
    };

    const DarAdmin = async (user) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dar-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                })
            });
            if (!response.ok) throw new Error('Error al asignar rol de administrador');
            const data = await response.json();
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === user.id ? { ...u, role: 'admin' } : u
                )
            );
            toast.success(data.message);
        } catch (error) {
            toast.error(`Error al asignar rol de administrador: ${error.message}`);
        }
    };

    const QuitarAdmin = async (user) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/quitar-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                })
            });
            if (!response.ok) throw new Error('Error al quitar rol de administrador');
            const data = await response.json();
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === user.id ? { ...u, role: 'user' } : u
                )
            );
            toast.success(data.message);
        } catch (error) {
            toast.error(`Error al quitar rol de administrador: ${error.message}`);
        }
    };

    const InvitarUsuario = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/invitar-usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: invitedUser
                })
            });
            if (!response.ok) throw new Error('Error al invitar al usuario');
            const data = await response.json();
            toast.success(data.message);
        } catch (error) {
            toast.error(`Error al invitar al usuario: ${error.message}`);
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    return (
        <Container fluid className="vh-100 w-100">
            <Navbar />
            <div className='contenidor m-3' style={{ display: 'flex', gap: '1rem' }}>
                <Card className='card-header' style={{ width: "15%" }}>
                    <Card.Body style={{ padding: "0" }}>
                        <ul className="nav nav-panel nav-pills nav-fill" data-bs-theme="light" style={{ display: "inline" }}>
                            <li className="nav-item" style={{ display: "flex", justifyContent: "start" }}>
                                <Button
                                    className={`nav-link nav-link-opcion btn-custom ${view === 1 && 'active'}`}
                                    onClick={() => goToPage(1)}
                                >
                                    <span className='d-flex justify-content-start'>
                                        <i><FontAwesomeIcon icon={faUser} className="me-1" /></i>
                                        <span className='text-span text-span-perfil'>Información Perfil</span>
                                    </span>
                                </Button>
                            </li>
                            <li className="nav-item">
                                <Button
                                    className={`nav-link nav-link-opcion btn-custom ${view === 2 && 'active'}`}
                                    onClick={() => goToPage(2)}
                                >
                                    <span className='d-flex justify-content-start'>
                                        <i><FontAwesomeIcon icon={faShield} className="me-1" /></i>
                                        <span className='text-span'>Seguridad</span>
                                    </span>
                                </Button>
                            </li>
                            {state.role === "admin" &&
                                <li className="nav-item">
                                    <Button
                                        className={`nav-link nav-link-opcion btn-custom ${view === 3 && 'active'}`}
                                        onClick={() => goToPage(3)}
                                    >
                                        <span className='d-flex justify-content-start'>
                                            <i><FontAwesomeIcon icon={faUsers} className="me-1" /></i>
                                            <span className='text-span'>Usuarios</span>
                                        </span>
                                    </Button>
                                </li>
                            }
                        </ul>
                    </Card.Body>
                </Card>

                <Card className='card-body' style={{ width: "84%" }}>
                    {view === 1 && (
                        <div className="" id="profile">
                            <h5>Información de usuario</h5>
                            <hr />
                            <form onSubmit={actualizarNombre}>
                                <div className="form-group py-1">
                                    <label htmlFor="fullName">Nombre</label>
                                    <input type="text" className="form-control" id="fullName" placeholder="Enter your fullname" value={nombre} onChange={e => setNombre(e.target.value)} required />
                                </div>
                                <div className="form-group py-1">
                                    Email
                                    <br />
                                    <input type="text" className="form-control" disabled value={state.email} />
                                </div>
                                <div className=" form-group py-1">
                                    Fecha alta
                                    <br />
                                    <input type="text" className="form-control" disabled value={formatDate(state.createdAt)} />
                                </div>
                                <hr />
                                <button type="submit" className="btn my-2 btn-custom">Actualizar Nombre</button>
                            </form>
                        </div>
                    )}

                    {view === 2 && (
                        <div id="security">
                            <h5>Cambiar de contraseña</h5>
                            <hr />
                            <form onSubmit={cambiarContraseña}>
                                <div className="form-group">
                                    <label className="d-block">Contraseña Actual <i className="fa-solid fa-eye"></i></label>
                                    <input type="password" className="form-control mt-1" id="oldPass" placeholder="Contraseña actual" onChange={e => setOldPass(e.target.value)} required />

                                    <label className="d-block pt-2">
                                        Nueva Contraseña{!passwordsMatch && <small style={{ color: "red" }}> Estas dos contraseñas no coinciden</small>} <i className="fa-solid fa-eye"></i>
                                    </label>
                                    <input type="password" className="form-control mt-1" id="newPass" placeholder="Nueva contraseña" onChange={e => setNewPass(e.target.value)} required />

                                    <label className="d-block pt-2">
                                        Confirmar Nueva Contraseña{!passwordsMatch && <small style={{ color: "red" }}> Estas dos contraseñas no coinciden</small>} <i className="fa-solid fa-eye"></i>
                                    </label>
                                    <input type="password" className="form-control mt-1" id="confirmNewPass" placeholder="Confirma nueva contraseña" onChange={e => setConfirmNewPass(e.target.value)} required />
                                </div>
                                <hr />
                                <button type="submit" className="btn btn-custom">Cambiar Contraseña</button>
                            </form>
                        </div>
                    )}

                    {view === 3 && state.role === "admin" && (
                        <div id="Users">
                            <h5>Invitar a un usuario nuevo</h5>
                            <hr />
                            <form onSubmit={InvitarUsuario}>
                                <div className="form-group">
                                    <label className="d-block">Correo</label>
                                    <input type="email" className="form-control" id="email" placeholder="nombre@thedesb.com" onChange={e => setInvitedUser(e.target.value)} required />
                                </div>
                                <div className="my-3">
                                    <button type="submit" className="btn btn-custom">Invitar usuario</button>
                                </div>
                            </form>
                            <hr />
                            <h5>Modificar administradores</h5>
                            <hr />
                            <Container fluid className="pt-3">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Admin</th>
                                            <th>Configuración</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users && users.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role === "admin" && <FontAwesomeIcon icon={faCheck} />}</td>
                                                <td>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id={`dropdown-${index}`} className="btn-custom">
                                                            <FontAwesomeIcon icon={faGear} />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className='conf-menu'>
                                                            {user.role !== "admin" && <Dropdown.Item onClick={() => DarAdmin(user)} className="btn-custom">Hacer Admin</Dropdown.Item>}
                                                            {user.role === "admin" && <Dropdown.Item disabled className="btn-custom">Ya es admin</Dropdown.Item>}
                                                            {user.role === "admin" && <Dropdown.Item onClick={() => QuitarAdmin(user)} className="btn-custom">Quitar Admin</Dropdown.Item>}
                                                            <Dropdown.Item disabled className="btn-custom">...</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Container>
                        </div>
                    )}
                </Card>
            </div>
            <ToastContainer
                theme="colored"
                position="bottom-right"
                hideProgressBar
                closeOnClick
            />
            <Footer /> 
        </Container>
    );
}

export default PanelAdministrador;

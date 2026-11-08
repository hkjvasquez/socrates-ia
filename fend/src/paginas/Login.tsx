
import { useState, type FormEvent } from 'react';

import {
    iniciarSesion,
    type UsuarioAutenticado
} from '../servicios/servicioAuth';

interface LoginProps {
    onLoginExitoso: (usuario: UsuarioAutenticado) => void;
}

export default function Login({ onLoginExitoso }: LoginProps) {

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const manejarLogin = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (cargando) return;

        try {

            setCargando(true);
            setError('');

            const respuesta = await iniciarSesion({
                correo,
                contrasena
            });

            if (!respuesta.exito || !respuesta.token) {
                setError('No fue posible iniciar sesión.');
                return;
            }

            localStorage.setItem('token', respuesta.token);

            localStorage.setItem(
                'usuario',
                JSON.stringify(respuesta.usuario)
            );

            onLoginExitoso(respuesta.usuario);

        } catch (error: any) {

            console.error('Error en inicio de sesión:', error);

            setError(
                error.response?.data?.mensaje ||
                'No fue posible conectar con el servidor.'
            );

        } finally {

            setCargando(false);

        }

    };

    return (
        <main className="login-container">

            <div className="login-card">

                <div className="login-logo">
                    Sócrates <span>IA</span>
                </div>

                <h1>Bienvenido</h1>

                <p>
                    Ingresa a tu espacio de aprendizaje.
                </p>

                <form onSubmit={manejarLogin}>

                    <div className="login-campo">

                        <label htmlFor="correo">
                            Correo electrónico
                        </label>

                        <input
                            id="correo"
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="tu@correo.com"
                            required
                            autoComplete="username"
                        />

                    </div>

                    <div className="login-campo">

                        <label htmlFor="contrasena">
                            Contraseña
                        </label>

                        <input
                            id="contrasena"
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                            autoComplete="current-password"
                        />

                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                    >
                        {cargando
                            ? 'Verificando acceso...'
                            : 'Iniciar sesión'
                        }
                    </button>

                </form>

            </div>

        </main>
    );

}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Login.css';
const api = process.env.REACT_APP_API_URL;
function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!identifier.trim()) err.identifier = 'Введите email или телефон';
    if (password.length < 4) err.password = 'Минимум 4 символа';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const api = process.env.REACT_APP_API_URL;
const res = await fetch(`${api}/login`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (!data.user.isVerified) {
          toast.error('Аккаунт ещё не подтверждён администратором', {
            position: 'top-right',
            theme: 'dark'
          });
          return;
        }

        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }

        onLogin(data.user);

        toast.success(`Добро пожаловать, ${data.user.name}!`, {
          position: 'top-right',
          autoClose: 7000,
          theme: 'dark'
        });

        setTimeout(() => {
          navigate(data.user.isAdmin ? '/admin' : '/profile');
        }, 1000);
      } else {
        toast.error(data.error || 'Ошибка входа', {
          position: 'top-right',
          theme: 'dark'
        });
      }
    } catch {
      toast.error('Ошибка сервера', {
        position: 'top-right',
        theme: 'dark'
      });
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Вход</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email или Телефон"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setErrors({});
          }}
        />
        {errors.identifier && <span className="error">{errors.identifier}</span>}

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors({});
          }}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Запомнить меня
        </label>

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;

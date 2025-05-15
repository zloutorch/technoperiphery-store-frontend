import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Register.css';
const api = process.env.REACT_APP_API_URL;

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (form.name.trim().length < 2) newErrors.name = 'Имя слишком короткое';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Неверный email';
    if (!/^\d{10,15}$/.test(form.phone)) newErrors.phone = 'Введите номер без пробелов, от 10 цифр';
    if (form.password.length < 6) newErrors.password = 'Пароль должен быть от 6 символов';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
     const res = await fetch(`${api}/register`, 
 {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Регистрация прошла успешно!', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark'
        });

        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.error || 'Ошибка регистрации', {
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
    <div className="register-container">
      <h2 className="register-title">Регистрация</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Имя" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input name="phone" placeholder="Телефон" value={form.phone} onChange={handleChange} />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register;

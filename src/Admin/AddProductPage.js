import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './AddProductPage.css';

function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image_url: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/admin/add-product', form)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Товар добавлен!',
          text: 'Новый товар успешно сохранён.',
          confirmButtonText: 'Ок',
          background: '#1a1a2e',
          color: '#fff',
          confirmButtonColor: '#00c8ff',
        });

        setForm({
          name: '',
          price: '',
          description: '',
          category: '',
          image_url: '',
        });
      })
      .catch(error => {
        const message = error.response?.data?.error || 'Не удалось добавить товар.';
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: message,
          confirmButtonText: 'Понятно',
          background: '#1a1a2e',
          color: '#fff',
          confirmButtonColor: '#d33',
        });
      });
  };

  return (
    <div className="add-product-container">
      <h2>Добавить товар</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Название"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Цена"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Выберите категорию</option>
          <option value="Клавиатуры">Клавиатуры</option>
          <option value="Мыши">Мыши</option>
          <option value="Наушники">Наушники</option>
          <option value="Мониторы">Мониторы</option>
          <option value="Аксессуары">Аксессуары</option>
        </select>
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="URL картинки"
        />
        <button type="submit">Добавить товар</button>
      </form>
    </div>
  );
}

export default AddProductPage;

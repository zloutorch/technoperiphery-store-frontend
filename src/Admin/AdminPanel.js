import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  return (
    <div className="admin-container">
      <h2 className="admin-title">Админ-панель</h2>
      <nav className="admin-nav">
        <Link className="admin-link" to="/admin/users">Пользователи</Link>
        <Link className="admin-link" to="/admin/orders">Заказы</Link>
        <Link className="admin-link" to="/admin/products">Товары</Link>
        <Link className="admin-link" to="/admin/add-product">Добавить товар</Link>
      </nav>
    </div>
  );
}

export default AdminPanel;

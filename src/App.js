import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useNavigate
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Shop from './Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';

import AdminPanel from './Admin/AdminPanel';
import UsersPage from './Admin/UsersPage';
import OrdersPage from './Admin/OrdersPage';
import ProductsPage from './Admin/ProductsPage';
import AddProductPage from './Admin/AddProductPage';

import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    toast.info('Вы вышли из аккаунта.', {
      position: 'top-right',
      autoClose: 3000,
      theme: 'dark'
    });
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-title">
          <Link to="/" className="logo-link">
            <img src="/logo.png" alt="Логотип" className="logo" />
          </Link>
          <h1>ТехноПериферия</h1>
        </div>
        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Главная</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Корзина ({cartItems.length})</NavLink>
          {currentUser ? (
            <>
              {currentUser.isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Панель администратора</NavLink>
              )}
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Профиль</NavLink>
              <button onClick={handleLogout} className="nav-link logout-button">Выйти</button>
            </>
          ) : (
            <>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Регистрация</NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Вход</NavLink>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Shop addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={(user) => setCurrentUser(user)} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/add-product" element={<AddProductPage />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          background: '#111428',
          color: '#fff',
          fontFamily: 'Segoe UI, sans-serif',
          borderRadius: '10px',
          boxShadow: '0 0 12px #00c8ff',
          padding: '12px 16px',
        }}
      />
    </Router>
  );
}

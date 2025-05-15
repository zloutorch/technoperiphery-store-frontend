import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './ProductsPage.css'; // используем те же стили
const api = process.env.REACT_APP_API_URL;

function UsersPage() {
  const [users, setUsers] = useState([]);

  // 🔁 Отдельная функция для загрузки пользователей
  const fetchUsers = () => {
    axios.get(`${api}/api/admin/users`)

      .then(res => setUsers(res.data))
      .catch(err => console.error('Ошибка загрузки пользователей:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = (user) => {
    Swal.fire({
      title: 'Подтвердить пользователя?',
      text: `${user.name} (${user.email})`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Подтвердить',
      cancelButtonText: 'Отмена',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'swal2-dark',
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        axios.post(`${api}/api/admin/verify-user/${user.id}`)

          .then(() => {
            fetchUsers(); // Обновляем таблицу после подтверждения
            Swal.fire({
              title: 'Успешно!',
              text: 'Пользователь подтверждён.',
              icon: 'success',
              background: '#1a1a2e',
              color: '#fff',
              confirmButtonColor: '#00c8ff'
            });
          })
          .catch(() => {
            Swal.fire({
              title: 'Ошибка',
              text: 'Не удалось подтвердить пользователя.',
              icon: 'error',
              background: '#1a1a2e',
              color: '#fff',
              confirmButtonColor: '#ff4d4f'
            });
          });
      }
    });
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: 'Удалить пользователя?',
      text: `${user.name} (${user.email})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'swal2-dark',
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`${api}/api/admin/delete-user/${user.id}`)

          .then(() => {
            fetchUsers(); // Обновляем таблицу после удаления
            Swal.fire({
              title: 'Удалено!',
              text: 'Пользователь был удалён.',
              icon: 'success',
              background: '#1a1a2e',
              color: '#fff',
              confirmButtonColor: '#00c8ff'
            });
          })
          .catch(() => {
            Swal.fire({
              title: 'Ошибка',
              text: 'Не удалось удалить пользователя.',
              icon: 'error',
              background: '#1a1a2e',
              color: '#fff',
              confirmButtonColor: '#ff4d4f'
            });
          });
      }
    });
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Пользователи</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Телефон</th>
            <th>Имя</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.name}</td>
              <td>{user.is_verified ? 'Подтверждён' : 'Не подтверждён'}</td>
              <td>
                {!user.is_verified && (
                  <button className="edit-btn" onClick={() => handleVerify(user)}>Подтвердить</button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(user)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;

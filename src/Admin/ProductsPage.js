import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './ProductsPage.css';
const api = process.env.REACT_APP_API_URL;

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${api}/api/admin/products`)

      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Удалить товар?',
      text: 'Это действие нельзя отменить!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Да, удалить',
      cancelButtonText: 'Отмена',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'swal2-dark',
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${api}/api/admin/product/${productId}`)

          .then(() => {
            setProducts(prev => prev.filter(p => p.id !== productId));
            Swal.fire({
              title: 'Удалено!',
              text: 'Товар был удалён.',
              icon: 'success',
              background: '#1a1a2e',
              color: '#fff',
              confirmButtonColor: '#00c8ff'
            });
          })
          .catch(() => {
            Swal.fire({
              title: 'Ошибка',
              text: 'Не удалось удалить товар.',
              icon: 'error',
              background: '#1a1a2e',
              color: '#fff',
              confirmButtonColor: '#ff4d4f'
            });
          });
      }
    });
  };

 const handleEdit = (product) => {
  Swal.fire({
    title: 'Редактировать товар',
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Название" value="${product.name || ''}">
      <input id="swal-price" type="number" class="swal2-input" placeholder="Цена" value="${product.price || ''}">
      <input id="swal-category" class="swal2-input" placeholder="Категория" value="${product.category || ''}">
      <textarea id="swal-description" class="swal2-textarea" placeholder="Описание">${product.description || ''}</textarea>
      <input id="swal-image" class="swal2-input" placeholder="URL изображения" value="${product.image_url || ''}">
    `,
    showCancelButton: true,
    confirmButtonText: 'Сохранить',
    cancelButtonText: 'Отмена',
    background: '#1a1a2e',
    color: '#fff',
    customClass: {
      popup: 'swal2-dark'
    },
    preConfirm: () => {
      const name = document.getElementById('swal-name').value;
      const price = document.getElementById('swal-price').value;
      const category = document.getElementById('swal-category').value;
      const description = document.getElementById('swal-description').value;
      const image_url = document.getElementById('swal-image').value;

      if (!name || !price || !category) {
        Swal.showValidationMessage('Название, цена и категория обязательны');
        return false;
      }

      return { name, price, category, description, image_url };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const updatedProduct = result.value;
     axios.put(`${api}/api/admin/product/${product.id}`, updatedProduct)

        .then(() => {
          setProducts(prev =>
            prev.map(p => p.id === product.id ? { ...p, ...updatedProduct } : p)
          );
          Swal.fire({
            title: 'Успешно!',
            text: 'Товар обновлён.',
            icon: 'success',
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonColor: '#00c8ff'
          });
        })
        .catch(() => {
          Swal.fire({
            title: 'Ошибка',
            text: 'Не удалось обновить товар.',
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
      <h2 className="products-title">Список товаров</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price} ₽</td>
              <td>{product.category}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Удалить</button>
                <button className="edit-btn" onClick={() => handleEdit(product)}>Редактировать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;

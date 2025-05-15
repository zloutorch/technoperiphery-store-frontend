// pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


import './ProductDetails.css';
const api = process.env.REACT_APP_API_URL;
function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
   const api = process.env.REACT_APP_API_URL;

fetch(`${api}/products`)

      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === parseInt(id));
        setProduct(found);
      })
      .catch((err) => console.error('Ошибка загрузки:', err));
  }, [id]);

  if (!product) return <p className="loading">Загрузка...</p>;

  return (
    <div className="product-details">
      <img src={product.image_url} alt={product.name} className="details-image" />
      <div className="details-info">
        <h2>{product.name}</h2>
        <p className="price"><strong>{product.price} ₽</strong></p>
        <p>{product.description}</p>
        <button
  onClick={() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error(' Сначала войдите в аккаунт');
      return;
    }
    addToCart(product);
  }}
  className="cart-button"
>
  В корзину
</button>


      </div>
    </div>
  );
}

export default ProductDetails;

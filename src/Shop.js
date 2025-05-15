import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Shop.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 30000]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Ошибка загрузки:', err));
  }, []);

  const filteredProducts = products.filter((p) => {
    const inCategory = categoryFilter ? p.category === categoryFilter : true;
    const inPriceRange = p.price >= priceRange[0] && p.price <= priceRange[1];
    return inCategory && inPriceRange;
  });

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="shop-container">
      <h2 className="section-title">Товары:</h2>

      <div className="filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Все категории</option>
          {uniqueCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="price-slider">
          <span>Цена: {priceRange[0]} ₽ – {priceRange[1]} ₽</span>
          <Slider
            range
            min={0}
            max={30000}
            defaultValue={[0, 30000]}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>

        <button className="reset-btn" onClick={() => {
          setCategoryFilter('');
          setPriceRange([0, 30000]);
        }}>
          Сбросить фильтры
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-results">Ничего не найдено по фильтрам</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-card fade-in">
              <Link to={`/product/${p.id}`} className="product-link">
                <img src={p.image_url} alt={p.name} className="product-image" />
                <h3>{p.name}</h3>
                <p><strong>{p.price} ₽</strong></p>
                <p className="product-stock"> В наличии: {p.stock} шт.</p>
                <p className="product-description">{p.description}</p>
              </Link>
              <button
  className="cart-button"
  onClick={() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error(' Сначала войдите в аккаунт');
      return;
    }
    addToCart(p);
  }}
>
  В корзину
</button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;

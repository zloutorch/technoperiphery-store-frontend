import React, { useEffect, useState } from 'react';
import './Profile.css';
const api = process.env.REACT_APP_API_URL;

function Profile() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

   const api = process.env.REACT_APP_API_URL;

fetch(`${api}/orders/user/${userId}`)

      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Ошибка загрузки заказов:', err));
  }, [userId]);

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const groupItems = (items) => {
    const map = new Map();
    items.forEach(item => {
      const key = item.name;
      if (map.has(key)) {
        map.get(key).count += 1;
      } else {
        map.set(key, { ...item, count: 1 });
      }
    });
    return Array.from(map.values());
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Мои заказы</h2>
        <p>Email: {user?.email}</p>
        <p>Телефон: {user?.phone}</p>
      </div>

      {orders.length === 0 ? (
        <p className="empty-text">Заказов пока нет.</p>
      ) : (
        <div className="order-list">
          {orders.map(order => {
            const isOpen = expandedOrders.includes(order.id);
            const groupedItems = groupItems(order.items || []);

            return (
              <div key={order.id} className="order-card" style={{ marginBottom: '20px' }}>
                <div className="order-header">
                  <span className="order-date" style={{ fontWeight: 'bold' }}>
                    📅 {new Date(order.created_at).toLocaleString()}
                  </span>
                  <button
                    className="toggle-button"
                    onClick={() => toggleOrder(order.id)}
                    style={{
                      marginLeft: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: '#00c8ff',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    {isOpen ? '▲' : '▼'}
                  </button>
                </div>

                {isOpen && (
                  <>
                    <div className="order-info">
                      <span className="order-total"><strong>Сумма:</strong> {parseFloat(order.total_price).toFixed(2)} ₽</span>
                      <div className="order-status">
                        <span className={`order-status ${
                          order.delivery_status === 'Ожидает отправки' ? 'status-awaiting' :
                          order.delivery_status === 'В пути' ? 'status-shipping' :
                          order.delivery_status === 'Доставлено' ? 'status-delivered' : ''
                        }`}>
                          {order.delivery_status === 'Ожидает отправки' && '⏳ Ожидает отправки'}
                          {order.delivery_status === 'В пути' && '🚚 В пути'}
                          {order.delivery_status === 'Доставлено' && '✅ Доставлено'}
                        </span>
                      </div>
                    </div>

                   <ul className="order-items">
  {(order.items || []).map((item, idx) => (
    <li key={idx} className="order-item">
      <img src={item.image_url} alt={item.name} className="item-image" />
      <div className="item-info">
        <div className="item-name">{item.name} {item.quantity > 1 && `×${item.quantity}`}</div>
        <div className="item-price">{item.price} ₽</div>
      </div>
    </li>
  ))}
</ul>

                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;

import React from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import './Cart.css';

export default function Cart({ cartItems, setCartItems }) {
  const groupedItems = cartItems.reduce((acc, item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) {
      found.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleQuantityChange = (productId, delta) => {
    const updated = [...cartItems];
    if (delta === -1) {
      const index = updated.findIndex(i => i.id === productId);
      if (index !== -1) updated.splice(index, 1);
    } else {
      const product = cartItems.find(i => i.id === productId);
      if (product) updated.push(product);
    }
    setCartItems(updated);
  };

 const handleOrder = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    toast.error('Сначала войдите в аккаунт');
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: 'Оформление заказа',
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Имя" value="${user.name || ''}" readonly>
      <input id="swal-phone" class="swal2-input" placeholder="Телефон" value="${user.phone || ''}" readonly>
      <input id="swal-address" class="swal2-input" placeholder="Адрес доставки">
      <textarea id="swal-comment" class="swal2-textarea" placeholder="Комментарий к заказу"></textarea>
      <label style="color: white; display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" id="swal-pay-later" checked>
        Оплата по факту получения
      </label>
    `,
    focusConfirm: false,
    confirmButtonText: 'Подтвердить заказ',
    cancelButtonText: 'Отмена',
    showCancelButton: true,
    background: '#1a1a2e',
    color: '#fff',
    customClass: {
      popup: 'swal2-dark'
    },
    preConfirm: () => {
      const address = document.getElementById('swal-address').value;
      const comment = document.getElementById('swal-comment').value;
      const payLater = document.getElementById('swal-pay-later').checked;

      if (!address.trim()) {
        Swal.showValidationMessage('Введите адрес доставки');
        return false;
      }

      return { address, comment, payLater };
    }
  });

  if (formValues) {
    // 👇 формируем items с quantity
    const groupedForOrder = groupedItems.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity
    }));

    fetch('http://localhost:5000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        name: user.name,
        phone: user.phone,
        address: formValues.address,
        comment: formValues.comment,
        payLater: formValues.payLater,
        items: groupedForOrder
      }),
    })
      .then(res => res.json())
      .then(() => {
        toast.success('✅ Заказ успешно оформлен!');
        setCartItems([]);
      })
      .catch(err => {
        console.error(err);
        toast.error('❌ Ошибка при оформлении заказа');
      });
  }
};


  return (
    <div className="cart-container">
      <h2 className="cart-title">Корзина</h2>

      {cartItems.length === 0 ? (
        <p className="empty-text">Корзина пуста</p>
      ) : (
        <>
          <div className="cart-items">
            {groupedItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-image" />
                <div className="cart-info">
                  <strong>{item.name}</strong>
                  <span>{item.price} ₽</span>
                  {item.quantity > 1 && (
                    <span className="quantity">Количество: {item.quantity} шт.</span>
                  )}
                </div>
                <div className="quantity-inline">
                  <button onClick={() => handleQuantityChange(item.id, -1)} className="qty-btn">−</button>
                  <button onClick={() => handleQuantityChange(item.id, 1)} className="qty-btn">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Итого: {totalPrice.toFixed(2)} ₽</h3>
            <button className="order-button" onClick={handleOrder}>Оформить заказ</button>
          </div>
        </>
      )}
    </div>
  );
}

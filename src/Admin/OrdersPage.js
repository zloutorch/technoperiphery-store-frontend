import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OrdersPage.css';
const api = process.env.REACT_APP_API_URL;

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${api}/api/admin/orders`)

      .then(response => setOrders(response.data))
      .catch(error => console.error('Ошибка загрузки заказов:', error));
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
  axios.post(`${api}/api/admin/orders/${orderId}/status`, { status: newStatus })

      .then(() => {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, delivery_status: newStatus } : order
          )
        );
      })
      .catch(err => {
        console.error('Ошибка обновления статуса:', err);
        alert('Не удалось обновить статус доставки');
      });
  };

  const sendInvoice = (orderId) => {
   axios.post(`${api}/api/admin/orders/${orderId}/send-invoice`)

      .then(() => {
        Swal.fire({
          title: '✅ Успешно!',
          text: 'Чек отправлен на почту покупателя.',
          icon: 'success',
          background: '#1a1a2e',
          color: '#fff',
          confirmButtonColor: '#00c8ff'
        });
      })
      .catch((err) => {
        console.error('Ошибка отправки чека:', err);
        Swal.fire({
          title: '❌ Не удалось отправить чек',
          text: 'Проверьте SMTP или логи сервера.',
          icon: 'error',
          background: '#1a1a2e',
          color: '#fff',
          confirmButtonColor: '#ff4d4f'
        });
      });
  };

const handleReportClick = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Сформировать отчёт',
    html: `
      <input type="date" id="start-date" class="swal2-input" placeholder="Дата с">
      <input type="date" id="end-date" class="swal2-input" placeholder="Дата по">
      <select id="status" class="swal2-select" style="padding: 10px; border-radius: 6px; margin-top: 10px;">
        <option value="">Все статусы</option>
        <option value="Ожидает отправки">Ожидает отправки</option>
        <option value="В пути">В пути</option>
        <option value="Доставлено">Доставлено</option>
      </select>
    `,
    focusConfirm: false,
    confirmButtonText: 'Скачать отчёт',
    confirmButtonColor: '#00c8ff',
    background: '#1a1a2e',
    color: '#fff',
    preConfirm: () => {
      const start = document.getElementById('start-date').value;
      const end = document.getElementById('end-date').value;
      const status = document.getElementById('status').value;

      if (!start || !end) {
        Swal.showValidationMessage('Выберите обе даты');
        return false;
      }

      return { start, end, status };
    }
  });

  if (formValues) {
    try {
      const { start, end, status } = formValues;

      const res = await axios.post(`${api}/api/admin/generate-report`, {
        from: start,
        to: end,
        status: status || null // если пусто — отправляем null
      }, { responseType: 'blob' });

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Отчёт_${start}_до_${end}${status ? `_(${status})` : ''}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Ошибка при генерации отчёта:', err);
      Swal.fire({
        title: 'Ошибка!',
        text: 'Не удалось сформировать отчёт.',
        icon: 'error',
        background: '#1a1a2e',
        color: '#fff',
        confirmButtonColor: '#ff4d4f'
      });
    }
  }
};

  return (
    <div className="orders-container">
      <h2 className="orders-title">Список заказов</h2>

      <div className="report-button-container">
        <button className="report-button" onClick={handleReportClick}>
          📄 Сформировать отчёт
        </button>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Товары</th>
            <th>Статус доставки</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.user_email}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.total_price} ₽</td>
              <td>
                {order.products.map((product, idx) => (
                  <div key={idx}>
                    {product.name} — {product.price} ₽
                  </div>
                ))}
              </td>
              <td>
                <select
                  className={`status-select ${
                    order.delivery_status === 'Ожидает отправки' ? 'status-awaiting' :
                    order.delivery_status === 'В пути' ? 'status-shipping' :
                    order.delivery_status === 'Доставлено' ? 'status-delivered' : ''
                  }`}
                  value={order.delivery_status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Ожидает отправки">⏳ Ожидает отправки</option>
                  <option value="В пути">🚚 В пути</option>
                  <option value="Доставлено">✅ Доставлено</option>
                </select>
              </td>
              <td>
                <button className="send-invoice-btn" onClick={() => sendInvoice(order.id)}>
                  📄 Отправить чек
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPage;

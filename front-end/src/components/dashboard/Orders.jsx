import React, { useState } from 'react'

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: 4582, customer: 'John Doe', items: '2 Veg Momos, 1 Chicken Momos', total: 24.97, status: 'Preparing', time: '5 minutes ago' },
    { id: 4581, customer: 'Sarah Miller', items: '1 Fried Momos, 1 Chili Sauce', total: 12.99, status: 'Delivered', time: '15 minutes ago' },
    { id: 4580, customer: 'Mike Thompson', items: '2 Mixed Momos, 2 Drinks', total: 36.98, status: 'Delivered', time: '32 minutes ago' },
    { id: 4579, customer: 'Emily Johnson', items: '1 Paneer Momos, 1 Soup', total: 15.98, status: 'Cancelled', time: '45 minutes ago' },
    { id: 4578, customer: 'David Wilson', items: '3 Beef Momos, 2 Drinks', total: 39.97, status: 'Delivered', time: '1 hour ago' },
  ])

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="order-filter">
          <select defaultValue="all">
            <option value="all">All Orders</option>
            <option value="preparing">Preparing</option>
            <option value="delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="orders-search">
        <input type="text" placeholder="Search by order ID or customer..." />
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.time}</td>
                <td className="actions-cell">
                  <button className="action-btn view">View</button>
                  <button className="action-btn update">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button>Previous</button>
        <span className="page-number active">1</span>
        <span className="page-number">2</span>
        <span className="page-number">3</span>
        <button>Next</button>
      </div>
    </div>
  )
}

export default Orders

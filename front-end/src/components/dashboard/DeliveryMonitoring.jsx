import React, { useState } from 'react'

const DeliveryMonitoring = () => {
  const [deliveries, setDeliveries] = useState([
    { id: 1, orderId: 4582, deliveryPerson: 'Alex Johnson', customer: 'John Doe', address: '123 Main St, Apt 4B', status: 'In Transit', estimatedTime: '15 mins' },
    { id: 2, orderId: 4579, deliveryPerson: 'Maria Garcia', customer: 'Emily Johnson', address: '456 Oak Ave', status: 'Delivered', estimatedTime: 'Completed' },
    { id: 3, orderId: 4577, deliveryPerson: 'Robert Smith', customer: 'Lisa Brown', address: '789 Pine St', status: 'Delivered', estimatedTime: 'Completed' },
    { id: 4, orderId: 4576, deliveryPerson: 'Sarah Lee', customer: 'Michael Davis', address: '234 Cedar Blvd', status: 'Preparing', estimatedTime: '30 mins' },
    { id: 5, orderId: 4575, deliveryPerson: 'James Wilson', customer: 'Samantha Taylor', address: '567 Elm St', status: 'In Transit', estimatedTime: '5 mins' },
  ])

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Delivery Monitoring</h2>
        <button className="action-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z"/>
          </svg>
          Export Report
        </button>
      </div>
      
      <div className="filter-bar">
        <div className="search-input">
          <input type="text" placeholder="Search by order or delivery person..." />
        </div>
        <div className="filter-select">
          <select defaultValue="all">
            <option value="all">All Status</option>
            <option value="preparing">Preparing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
      
      <div className="map-container">
        <div className="delivery-map">
          <div className="placeholder-map">
            <p>Delivery Map would be displayed here</p>
            <p>Using Google Maps or similar service integration</p>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Delivery Person</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>{delivery.id}</td>
                <td>#{delivery.orderId}</td>
                <td>{delivery.deliveryPerson}</td>
                <td>{delivery.customer}</td>
                <td>{delivery.address}</td>
                <td>
                  <span className={`status-badge ${delivery.status.toLowerCase().replace(' ', '-')}`}>
                    {delivery.status}
                  </span>
                </td>
                <td>{delivery.estimatedTime}</td>
                <td className="action-cell">
                  <button className="table-btn view">Track</button>
                  <button className="table-btn edit">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button className="pagination-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      <style jsx>{`
        .map-container {
          margin-bottom: 20px;
        }
        
        .delivery-map {
          height: 300px;
          background-color: #f0f2f5;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .placeholder-map {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #767785;
        }
      `}</style>
    </div>
  )
}

export default DeliveryMonitoring

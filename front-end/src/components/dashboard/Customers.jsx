import React, { useState } from 'react'

const Customers = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-123-4567', orders: 15, status: 'Active' },
    { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', phone: '555-234-5678', orders: 8, status: 'Active' },
    { id: 3, name: 'Mike Thompson', email: 'mike@example.com', phone: '555-345-6789', orders: 3, status: 'Inactive' },
    { id: 4, name: 'Emily Johnson', email: 'emily@example.com', phone: '555-456-7890', orders: 12, status: 'Active' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '555-567-8901', orders: 6, status: 'Active' },
  ])

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h2>Customer Management</h2>
      </div>
      
      <div className="customers-search">
        <input type="text" placeholder="Search customers..." />
        <select defaultValue="all">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
                <td>
                  <span className={`status-badge ${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn view">View</button>
                  <button className="action-btn edit">Edit</button>
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
        <button>Next</button>
      </div>
    </div>
  )
}

export default Customers

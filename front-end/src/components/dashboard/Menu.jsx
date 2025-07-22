import React, { useState } from 'react'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Steamed Vegetable Momos', category: 'Veg', price: 7.99, status: 'Available' },
    { id: 2, name: 'Fried Chicken Momos', category: 'Non-Veg', price: 9.99, status: 'Available' },
    { id: 3, name: 'Paneer Momos', category: 'Veg', price: 8.99, status: 'Available' },
    { id: 4, name: 'Beef Momos', category: 'Non-Veg', price: 10.99, status: 'Out of Stock' },
    { id: 5, name: 'Mixed Momos Platter', category: 'Non-Veg', price: 14.99, status: 'Available' },
  ])

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h2>Menu Management</h2>
        <button className="add-item-btn">Add New Item</button>
      </div>
      
      <div className="menu-search">
        <input type="text" placeholder="Search menu items..." />
        <select defaultValue="all">
          <option value="all">All Categories</option>
          <option value="veg">Vegetarian</option>
          <option value="non-veg">Non-Vegetarian</option>
        </select>
      </div>
      
      <div className="menu-table-container">
        <table className="menu-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <span className={`category-badge ${item.category.toLowerCase().replace('-', '')}`}>
                    {item.category}
                  </span>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase().replace(' ', '')}`}>
                    {item.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn delete">Delete</button>
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

export default Menu

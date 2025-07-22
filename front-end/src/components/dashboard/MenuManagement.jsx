import React, { useState, useEffect } from 'react'
import { db } from '../../firebase.jsx';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    status: '',
    imageUrl: '' // Use imageUrl for public image
  })
  const [errors, setErrors] = useState({})
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch menu items from Firestore
  const fetchMenu = async () => {
    setLoading(true)
    setError('')
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError('Failed to fetch menu items.');
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const handleOpenModal = () => {
    setForm({ name: '', description: '', category: '', price: '', status: '', imageUrl: '' })
    setErrors({})
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setForm({ name: '', description: '', category: '', price: '', status: '', imageUrl: '' })
    setErrors({})
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required.'
    if (!form.description.trim()) newErrors.description = 'Description is required.'
    if (!form.category) newErrors.category = 'Category is required.'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = 'Valid price is required.'
    if (!form.status) newErrors.status = 'Status is required.'
    if (!form.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    handleAddMenuItem(form)
  }

  const handleAddMenuItem = async (form) => {
    setError('');
    try {
      await addDoc(collection(db, 'menuItems'), {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        status: form.status,
        imageUrl: form.imageUrl
      });
      setShowModal(false);
      setForm({ name: '', description: '', category: '', price: '', status: '', imageUrl: '' });
      setErrors({});
      fetchMenu();
    } catch (err) {
      setError('Failed to add menu item.');
    }
  };

  const handleEditMenuItem = async (id, form) => {
    setError('');
    try {
      await updateDoc(doc(db, 'menuItems', id), {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        status: form.status,
        imageUrl: form.imageUrl
      });
      setShowEditModal(false);
      setEditItem(null);
      fetchMenu();
    } catch (err) {
      setError('Failed to update menu item.');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    setError('');
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      fetchMenu();
    } catch (err) {
      setError('Failed to delete menu item.');
    }
  };

  function openEditModal(item) {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      status: item.status,
      imageUrl: item.imageUrl || ''
    });
    setErrors({});
    setShowEditModal(true);
  }
  function closeEditModal() {
    setShowEditModal(false);
    setEditItem(null);
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    handleEditMenuItem(editItem.id, form);
  };

  const handleDeleteClick = (id) => setDeleteId(id);
  const confirmDelete = async () => {
    if (deleteId) {
      await handleDeleteMenuItem(deleteId);
      setDeleteId(null);
    }
  };
  const cancelDelete = () => setDeleteId(null);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Menu Management</h2>
        <button className="action-button" onClick={handleOpenModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Add New Item
        </button>
      </div>
      
      <div className="filter-bar">
        <div className="search-input">
          <input type="text" placeholder="Search menu items..." />
        </div>
        <div className="filter-select">
          <select defaultValue="all">
            <option value="all">All Categories</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>Loading menu...</div>
        ) : error ? (
          <div style={{ color: '#e53935', padding: 20, textAlign: 'center' }}>{error}</div>
        ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>Rs {Number(item.price).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${item.status === 'Available' ? 'available' : 'outofstock'}`}> 
                    {item.status === 'Available' ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} style={{ maxWidth: 60, borderRadius: 8 }} />
                  )}
                </td>
                <td className="action-cell">
                  <button className="table-btn edit" onClick={() => openEditModal(item)}>Edit</button>
                  <button className="table-btn delete" onClick={() => handleDeleteClick(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
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
      {showModal && (
        <div className="modal-backdrop" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="modal-form" style={{background:'#1e293b', color:'#e1e1e1',borderRadius:12,padding:32,minWidth:340,maxWidth:400,boxShadow:'0 8px 32px rgba(0,0,0,0.15)',position:'relative', maxHeight:'90vh', overflowY:'auto'}}>
            <button onClick={handleCloseModal} style={{position:'absolute',top:12,right:16,background:'none',border:'none',color:'#e1e1e1',fontSize:22,cursor:'pointer',zIndex:2}} aria-label="Close">&times;</button>
            <h3 style={{marginTop:0,marginBottom:20,fontSize:20,fontWeight:600}}>Add New Menu Item</h3>
            <form onSubmit={handleSubmit} className="add-menu-form" autoComplete="off">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} autoFocus />
                {errors.name && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} style={{resize:'vertical',width:'100%',padding:'10px 15px',borderRadius:5,border:'1px solid #ddd',fontSize:16}} />
                {errors.description && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.description}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value=" Classic Momos"> Classic Momos</option>
                  <option value="Pan Fried Momos">Pan Fried Momos</option>
                  <option value="Spicy Gravy Momos">Spicy Gravy Momos</option>
                  <option value="Creamy Momos">Creamy Momos</option>
                  <option value="Steak Sauce Momos">Steak Sauce Momos</option>
                  <option value="Newly Launched Momos">Newly Launched Momos</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Soups">Soups</option>
                  <option value="Chinese Entrees">Chinese Entrees</option>
                  <option value="Chilli Potato">Chilli Potato</option>
                  <option value="Beverages">Beverages</option>
                </select>
                {errors.category && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.category}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" />
                {errors.price && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.price}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                {errors.status && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.status}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input type="text" id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Paste public image URL here" />
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{marginTop:10,maxWidth:80,maxHeight:80,borderRadius:8,objectFit:'cover',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}} />}
                {errors.imageUrl && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.imageUrl}</div>}
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}}>
                <button type="button" className="table-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="action-button">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal-backdrop" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="modal-form" style={{background:'#1e293b', color:'#e1e1e1',borderRadius:12,padding:32,minWidth:340,maxWidth:400,boxShadow:'0 8px 32px rgba(0,0,0,0.15)',position:'relative'}}>
            <h3 style={{marginTop:0,marginBottom:20,fontSize:20,fontWeight:600}}>Edit Menu Item</h3>
            <form onSubmit={handleEditSubmit} className="add-menu-form" autoComplete="off">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input type="text" id="edit-name" name="name" value={form.name} onChange={handleChange} />
                {errors.name && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea id="edit-description" name="description" value={form.description} onChange={handleChange} rows={3} style={{resize:'vertical',width:'100%',padding:'10px 15px',borderRadius:5,border:'1px solid #ddd',fontSize:16}} />
                {errors.description && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.description}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select id="edit-category" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="Classic Momos">Classic Momos</option>
                  <option value="Pan Fried Momos">Pan Fried Momos</option>
                  <option value="Spicy Gravy Momos">Spicy Gravy Momos</option>
                  <option value="Creamy Momos">Creamy Momos</option>
                  <option value="Steak Sauce Momos">Steak Sauce Momos</option>
                  <option value="Newly Launched Momos">Newly Launched Momos</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Soups">Soups</option>
                  <option value="Chinese Entrees">Chinese Entrees</option>
                  <option value="Chilli Potato">Chilli Potato</option>
                  <option value="Beverages">Beverages</option>
                </select>
                {errors.category && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.category}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="edit-price">Price</label>
                <input type="number" id="edit-price" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" />
                {errors.price && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.price}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                <select id="edit-status" name="status" value={form.status} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                {errors.status && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.status}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="edit-imageUrl">Image URL</label>
                <input type="text" id="edit-imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Paste public image URL here" />
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{marginTop:10,maxWidth:80,maxHeight:80,borderRadius:8,objectFit:'cover',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}} />}
                {errors.imageUrl && <div className="error-message" style={{color:'#e53935',fontSize:13}}>{errors.imageUrl}</div>}
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}}>
                <button type="button" className="table-btn" onClick={closeEditModal}>Cancel</button>
                <button type="submit" className="action-button">Update Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Delete Item</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button className="confirm" onClick={confirmDelete}>Yes, delete</button>
              <button className="cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuManagement

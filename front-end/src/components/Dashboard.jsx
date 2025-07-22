import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import Overview from './dashboard/Overview'
import OrderManagement from './dashboard/OrderManagement'
import MenuManagement from './dashboard/MenuManagement'
import CustomerManagement from './dashboard/CustomerManagement'
import DeliveryMonitoring from './dashboard/DeliveryMonitoring'
import Settings from './dashboard/Settings'
import '../styles/Dashboard.css'
import momoLogo from '../assets/Logo.webp'

const Dashboard = ({ onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '2 minutes ago', read: false },
    { id: 2, message: 'John Smith left a review', time: '15 minutes ago', read: false },
    { id: 3, message: 'Delivery delayed for order #4582', time: '1 hour ago', read: true }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length
  
  useEffect(() => {
    // Close notifications panel when clicking outside
    const handleClickOutside = (e) => {
      if (showNotifications && !e.target.closest('.notification-panel') && !e.target.closest('.notification-bell')) {
        setShowNotifications(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }
  
  const handleLogoutClick = () => setShowLogoutConfirm(true)
  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }
  const cancelLogout = () => setShowLogoutConfirm(false)
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'Order Management'
    if (path.includes('/menu')) return 'Menu Management'
    if (path.includes('/customers')) return 'Customer Management'
    if (path.includes('/delivery')) return 'Delivery Monitoring'
    if (path.includes('/settings')) return 'Settings'
    return 'Dashboard Overview'
  }

  return (
    <div className={`dashboard-container ${isSidebarOpen ? '' : 'sidebar-collapsed'} ${darkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={momoLogo} alt="Little Momo" className="momo-sidebar-logo" />
            {isSidebarOpen && <h2>Little Momo</h2>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            {isSidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          
          <Link to="/dashboard/orders" className={`nav-item ${location.pathname.includes('/orders') ? 'active' : ''}`}>
            <span className="nav-icon">🧾</span>
            {isSidebarOpen && <span className="nav-text">Orders</span>}
            <span className="nav-badge">12</span>
          </Link>
          
          <Link to="/dashboard/menu" className={`nav-item ${location.pathname.includes('/menu') ? 'active' : ''}`}>
            <span className="nav-icon">🍲</span>
            {isSidebarOpen && <span className="nav-text">Menu</span>}
          </Link>
          
          <Link to="/dashboard/customers" className={`nav-item ${location.pathname.includes('/customers') ? 'active' : ''}`}>
            <span className="nav-icon">👥</span>
            {isSidebarOpen && <span className="nav-text">Customers</span>}
          </Link>
          
          <Link to="/dashboard/delivery" className={`nav-item ${location.pathname.includes('/delivery') ? 'active' : ''}`}>
            <span className="nav-icon">🚚</span>
            {isSidebarOpen && <span className="nav-text">Delivery</span>}
          </Link>
          
          <Link to="/dashboard/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
            <span className="nav-icon">⚙️</span>
            {isSidebarOpen && <span className="nav-text">Settings</span>}
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogoutClick}>
            <span className="nav-icon">🚪</span>
            {isSidebarOpen && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <div className="dashboard-header">
          <div className="header-title">
            <h1>{getPageTitle()}</h1>
            <span className="subtitle">Little Momo Downtown Branch</span>
          </div>
          
          <div className="dashboard-controls">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <button className="search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
            
            <div className="notification-bell">
              <button 
                className="bell-btn" 
                onClick={toggleNotifications}
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              
              {showNotifications && (
                <div className="notification-panel">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-btn" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="theme-toggle" 
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                </svg>
              )}
            </button>
            
            <div className="user-profile">
              <div className="avatar-circle">RM</div>
              <span className="user-name">Restaurant Manager</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/orders/*" element={<OrderManagement />} />
            <Route path="/menu/*" element={<MenuManagement />} />
            <Route path="/customers/*" element={<CustomerManagement />} />
            <Route path="/delivery/*" element={<DeliveryMonitoring />} />
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Log Out</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="confirm" onClick={confirmLogout}>Yes, log out</button>
              <button className="cancel" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

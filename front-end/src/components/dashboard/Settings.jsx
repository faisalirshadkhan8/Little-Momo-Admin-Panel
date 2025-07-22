import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Dashboard Settings</h2>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h3>Account Settings</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" defaultValue="admin" />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" defaultValue="admin@example.com" />
            </div>
            
            <button className="save-btn">Update Account</button>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Password</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input type="password" id="current-password" />
            </div>
            
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input type="password" id="new-password" />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" />
            </div>
            
            <button className="save-btn">Change Password</button>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Notification Settings</h3>
          <div className="settings-form">
            <div className="form-check">
              <input type="checkbox" id="email-notifications" defaultChecked />
              <label htmlFor="email-notifications">Email Notifications</label>
            </div>
            
            <div className="form-check">
              <input type="checkbox" id="push-notifications" defaultChecked />
              <label htmlFor="push-notifications">Push Notifications</label>
            </div>
            
            <div className="form-check">
              <input type="checkbox" id="update-notifications" defaultChecked />
              <label htmlFor="update-notifications">System Update Notifications</label>
            </div>
            
            <button className="save-btn">Save Preferences</button>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Theme Settings</h3>
          <div className="theme-settings">
            <div className="form-check theme-toggle-option">
              <input 
                type="checkbox" 
                id="dark-mode-toggle" 
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <label htmlFor="dark-mode-toggle">Dark Mode</label>
            </div>
            
            <div className="theme-options">
              <div className={`theme-option ${!darkMode ? 'selected' : ''}`} onClick={() => darkMode && toggleDarkMode()}>
                <div className="theme-preview light"></div>
                <span>Light</span>
              </div>
              <div className={`theme-option ${darkMode ? 'selected' : ''}`} onClick={() => !darkMode && toggleDarkMode()}>
                <div className="theme-preview dark"></div>
                <span>Dark</span>
              </div>
              <div className="theme-option">
                <div className="theme-preview blue"></div>
                <span>Blue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

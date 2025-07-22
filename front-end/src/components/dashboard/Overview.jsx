import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.jsx';
import { collection, getDocs } from 'firebase/firestore';

const Overview = () => {
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUserCount(querySnapshot.size);
      } catch (err) {
        setUserCount('—');
      }
    };
    fetchUserCount();
  }, []);

  return (
    <div className="overview-container">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(78, 47, 18, 0.1)', color: '#4e2f12' }}>👥</div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{userCount !== null ? userCount : '...'}</p>
            <p className="stat-change positive">&nbsp;</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(251, 154, 15, 0.1)', color: '#fb9a0f' }}>📊</div>
          <div className="stat-details">
            <h3>Revenue</h3>
            <p className="stat-value">$34,252</p>
            <p className="stat-change positive">+8% this month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(78, 47, 18, 0.1)', color: '#4e2f12' }}>📦</div>
          <div className="stat-details">
            <h3>Products</h3>
            <p className="stat-value">324</p>
            <p className="stat-change negative">-2% this month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(251, 154, 15, 0.1)', color: '#fb9a0f' }}>📑</div>
          <div className="stat-details">
            <h3>Orders</h3>
            <p className="stat-value">642</p>
            <p className="stat-change positive">+15% this month</p>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">
            <p>Chart visualization would go here</p>
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-details">
                <p>New user registered</p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-details">
                <p>New order placed</p>
                <p className="activity-time">15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">⚙️</div>
              <div className="activity-details">
                <p>System updated</p>
                <p className="activity-time">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview

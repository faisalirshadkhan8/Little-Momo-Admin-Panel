import React, { useState, useEffect } from 'react'
import { collection, query, orderBy, where, onSnapshot, doc, updateDoc, serverTimestamp, runTransaction } from 'firebase/firestore'
import { db } from '../../firebase'
import { toast } from 'react-toastify'
import StatusUpdateModal from './StatusUpdateModal'
import { getFunctions, httpsCallable } from 'firebase/functions'
import './OrderManagement.css'
  
const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Define valid state transitions
  const validTransitions = {
    'Placed': ['Pending', 'Preparing', 'Cancelled'], // <-- add this line
    'Pending': ['Preparing', 'Cancelled'],
    'Preparing': ['Out for Delivery', 'Cancelled'],
    'Out for Delivery': ['Delivered', 'Cancelled'],
    'Delivered': [],
    'Cancelled': []
  }

  // Format Firestore timestamp to readable time (e.g. "5 minutes ago")
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    
    const now = new Date();
    const orderDate = timestamp.toDate();
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  // Format items from array to readable string
  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    
    return items.map(item => 
      `${item.quantity} ${item.name}`
    ).join(', ');
  };

  // Handle updating order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await transaction.get(orderRef);
        if (!orderDoc.exists()) {
          throw new Error("Order not found");
        }
        const orderData = orderDoc.data();
        // Validate state transition
        if (!validTransitions[orderData.status].includes(newStatus)) {
          throw new Error(`Cannot change order from ${orderData.status} to ${newStatus}`);
        }
        // Prepare update data
        const updateData = {
          status: newStatus,
          updatedAt: serverTimestamp()
        };
        if (newStatus === 'Delivered') {
          updateData.deliveredAt = serverTimestamp();
        }
        transaction.update(orderRef, updateData);
        // --- PUSH NOTIFICATION LOGIC ---
        if ([
          'Delivered',
          'Preparing',
          'Out for Delivery',
          'Cancelled'
        ].includes(newStatus)) {
          // Call the Cloud Function to send push notification
          const functions = getFunctions();
          const sendOrderStatusNotification = httpsCallable(functions, 'sendOrderStatusNotification');
          let title = 'Order Update';
          let body = '';
          if (newStatus === 'Delivered') body = `Your order #${orderDoc.id} has been delivered!`;
          if (newStatus === 'Preparing') body = `Your order #${orderDoc.id} is being prepared!`;
          if (newStatus === 'Out for Delivery') body = `Your order #${orderDoc.id} is out for delivery!`;
          if (newStatus === 'Cancelled') body = `Your order #${orderDoc.id} has been cancelled.`;
          // Fire and forget (don't block transaction)
          sendOrderStatusNotification({
            userId: orderData.userId,
            title,
            body
          });
        }
        // Optional: Log to audit trail
        const auditRef = collection(db, 'audit_logs');
        transaction.set(doc(auditRef), {
          action: 'ORDER_STATUS_UPDATED',
          orderId: orderId,
          previousStatus: orderData.status,
          newStatus: newStatus,
          updatedBy: 'admin', // Ideally use actual admin ID
          timestamp: serverTimestamp()
        });
      });
      toast.success(`Order status updated to ${newStatus}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Failed to update order status");
    }
  };

  // Handle opening the status update modal
  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      (order.customer && order.customer.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    // Set up Firestore query
    let ordersQuery = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc')
    )
    
    if (statusFilter !== 'all') {
      ordersQuery = query(
        collection(db, 'orders'), 
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc')
      )
    }
    
    // Create real-time listener
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format timestamps for display
        time: formatTimestamp(doc.data().createdAt),
      }))
      setOrders(ordersData)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
      setLoading(false)
    })
    
    // Clean up on unmount
    return () => unsubscribe()
  }, [statusFilter])

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Order Management</h2>
        <button className="action-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          New Order
        </button>
      </div>
        <div className="filter-bar">
        <div className="search-input">
          <input 
            type="text" 
            placeholder="Search by order ID or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
        <div className="table-container">
        {loading ? (
          <div className="loading-indicator">Loading orders...</div>
        ) : (
          <table className="data-table">
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{formatItems(order.items)}</td>
                    <td>${order.total?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`status-badge ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.time}</td>
                    <td className="action-cell">
                      <button className="table-btn view">View</button>
                      <button 
                        className="table-btn edit" 
                        onClick={() => handleUpdateClick(order)}
                        disabled={
                          order.status === 'Delivered' || 
                          order.status === 'Cancelled'
                        }
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>

      {/* Status Update Modal */}
      {isModalOpen && selectedOrder && (
        <StatusUpdateModal
          order={selectedOrder}
          validTransitions={validTransitions[selectedOrder.status] || []}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}

export default OrderManagement

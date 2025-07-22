import React, { useState } from 'react';
import './StatusUpdateModal.css';

const StatusUpdateModal = ({ order, validTransitions, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(validTransitions[0] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStatus) return;
    
    setIsSubmitting(true);
    try {
      await onUpdateStatus(order.id, selectedStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Update Order Status</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="order-info">
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Current Status:</strong> 
              <span className={`status-badge ${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
          </div>
          
          {validTransitions.length === 0 ? (
            <div className="no-transitions">
              <p>No status changes are allowed for this order.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="new-status">Select New Status:</label>
                <select 
                  id="new-status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>Select status</option>
                  {validTransitions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="status-description">
                {selectedStatus === 'Delivered' && (
                  <p>This will notify the customer that their order has been delivered and create an in-app notification.</p>
                )}
                {selectedStatus === 'Preparing' && (
                  <p>This will update the order to preparing status and notify the customer.</p>
                )}
                {selectedStatus === 'Out for Delivery' && (
                  <p>This will update the order to out for delivery status and notify the customer.</p>
                )}
                {selectedStatus === 'Cancelled' && (
                  <p>This will cancel the order and notify the customer. This action cannot be undone.</p>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="confirm-button"
                  disabled={!selectedStatus || isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Confirm Status Change'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;

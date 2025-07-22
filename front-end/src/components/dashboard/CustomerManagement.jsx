import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.jsx';
import { collection, getDocs } from 'firebase/firestore';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError('');
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setCustomers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to fetch customers.');
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Customer Management</h2>
      </div>
      {loading ? (
        <div>Loading customers...</div>
      ) : error ? (
        <div style={{ color: '#e53935' }}>{error}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={customer.id}>
                <td>{idx + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerManagement;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/users/${editingUser.id}`, formData);
      setEditingUser(null);
      setFormData({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:3001/users', newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user', error);
    }
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      
      <div className="add-form">
        <h2>Add New User</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
          <label>
            Name:
            <input type="text" name="name" value={newUser.name} onChange={handleNewUserInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={newUser.email} onChange={handleNewUserInputChange} />
          </label>
          <button type="submit">Add User</button>
        </form>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-form">
          <h2>Edit User</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </label>
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;

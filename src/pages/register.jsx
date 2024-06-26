import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';           
import { TextField, MenuItem, Button, Typography, CircularProgress, FormControl, InputLabel, Select, Alert } from '@mui/material';
import { levels } from '../utils/constants';
import { roles } from '../utils/roles';

const Registration = () => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!email || !password || !name || !role || (role === 'STUDENT' && !level)) {
      setLoading(false);
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { 
        name, 
        email, 
        role,
        level: role === 'STUDENT' ? level : null,
      });
      setLoading(false);
      setSuccess('Registration successful!');
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(`Error registering: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', 
    display: 'flex', flexDirection: 'column', minHeight: '75vh' }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
      <TextField 
        label="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        style={{ marginBottom: '20px' }}
      />
      <TextField 
        label="Email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        style={{ marginBottom: '20px' }}
      />
      <TextField 
        label="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        style={{ marginBottom: '20px' }}
      />
      <FormControl required style={{ marginBottom: '20px' }}>
        <InputLabel>Role</InputLabel>
        <Select value={role} onChange={handleRoleChange}>
          {roles.map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {role === 'STUDENT' && (
        <FormControl required style={{ marginBottom: '20px' }}>
          <InputLabel>Level</InputLabel>
          <Select value={level} onChange={handleLevelChange}>
            {levels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
    </form>
  );
};

export default Registration;

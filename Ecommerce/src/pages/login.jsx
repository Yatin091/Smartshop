import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Optional: for redirect after login
import { Link } from 'react-router-dom'; // Import Link for navigation to signup page

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  // Using React Router's useNavigate hook to redirect user after login
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      
      // Get the JWT token from response
      const { token } = response.data;
      
      // Save the token to localStorage
      localStorage.setItem('token', token);
      
      // Set the token state in the component (optional, for UI feedback)
      setToken(token);
      
      // Optionally, show a success message
      setMessage(response.data.message);
      setError('');

      // Redirect the user after successful login (optional)
      navigate('/');  // You can replace '/dashboard' with any page you want to redirect to

    } catch (error) {
      // Handle any errors from the API (invalid credentials, etc.)
      setError(error.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  // Function to handle "Login as Admin" (you can adjust the logic here)
  const handleAdminLogin = () => {
    navigate('/admin-login'); // Replace with your actual admin login page
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>

        {/* Button for Admin login */}
        <button
          type="button"
          onClick={handleAdminLogin}
          style={{ ...styles.button, backgroundColor: '#2196F3' ,marginTop:'10px'}} // Different color for admin login button
        >
          Login as Admin
        </button>

        {/* Sign Up Link */}
        <div style={styles.signupLink}>
          <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

// Inline styling for the login page
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f2f4f7',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    marginBottom: '10px',
    transition: 'border-color 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    marginBottom: '15px',
    fontSize: '14px',
  },
  signupLink: {
    marginTop: '20px',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  linkHover: {
    textDecoration: 'underline',
  },
};

export default Login;

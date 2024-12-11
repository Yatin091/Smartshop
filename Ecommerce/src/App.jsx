import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import UploadProduct from './pages/UploadProduct';
import AdminLogin from './pages/admin-logi';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Dashboard/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<UploadProduct />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;


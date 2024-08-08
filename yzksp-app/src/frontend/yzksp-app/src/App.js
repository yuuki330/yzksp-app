import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';

import { AuthProvider } from './login_component/AuthContext';
import MainView from './views/MainView';
import Login from './login_component/Login';
import LogoutView from './views/LogoutView';
import Register from './login_component/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutView />} />
        <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
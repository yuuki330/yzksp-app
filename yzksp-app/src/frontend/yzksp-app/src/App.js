import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import CreateEventPage from './pages/CreateEventPage';
import UpdateEventPage from './pages/UpdateEventPage';
import Login from './login_component/Login';
import Register from './login_component/Register';
import CalendarView from './components/CalendarView';

function Navigation() {
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log('Navigation: user state changed', user);
  }, [user]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/" className="text-gray-800 hover:text-blue-600 transition duration-300">ホーム</Link>
          </li>
          <li>
            <Link to="/events" className="text-gray-800 hover:text-blue-600 transition duration-300">イベント一覧</Link>
          </li>
          <li>
            <Link to="/events/create" className="text-gray-800 hover:text-blue-600">イベント作成</Link>
          </li>
          {user ? (
            <li>
              <button onClick={logout} className="text-gray-800 hover:text-blue-600 bg-gray-200 px-3 py-1 rounded">ログアウト</button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-gray-800 hover:text-blue-600">ログイン</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-800 hover:text-blue-600 bg-gray-200 px-3 py-1 rounded">登録</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
      console.log('AppContent: user state changed', user);
  }, [user]);

  return (
      <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-6 py-8">
              <Routes>
                  <Route path="/" element={<CalendarView />} />
                  <Route path="/events" element={<EventList />} />
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/events/:id/edit" element={<UpdateEventPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
          </main>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
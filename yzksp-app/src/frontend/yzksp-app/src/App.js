import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-6 py-3">
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="text-gray-800 hover:text-blue-600 transition duration-300">ホーム</Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-800 hover:text-blue-600 transition duration-300">イベント一覧</Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<h1 className="text-3xl font-bold text-gray-800 mb-4">出欠管理アプリへようこそ</h1>} />
              <Route path="events" element={<EventList />} />
              <Route path="events/:id" element={<EventDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
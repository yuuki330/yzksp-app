import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from 'react-router-dom';
import EventList from './components/EventList';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            <li>
              <Link to="/events">イベント一覧</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="events" element={<EventList />} />
          <Route path="/" element={<h1>出欠管理アプリへようこそ</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
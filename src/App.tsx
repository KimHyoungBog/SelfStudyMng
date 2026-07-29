import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Today from './pages/Today';
import Settings from './pages/Settings';
import Weekly from './pages/Weekly';

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1>학습관리</h1>
        <nav>
          <NavLink to="/" end>오늘</NavLink>
          <NavLink to="/weekly">주간</NavLink>
          <NavLink to="/settings">설정</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import RegistrationFlow from './components/Registration';
import MainPage from './pages/Main';
import Dashboard from './pages/Dashboard';
import { Context } from './main';

const App = () => {
  const { store } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  useEffect(() => {
    if (store.isAuth) {
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/registration') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [store.isAuth, location.pathname, navigate]);

  if (store.isLoading) {
    return <div>Загузка..</div>;
  }

  if (!store.isAuth) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationFlow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainPage userName={store.user.name || store.user.email} onLogout={() => store.logout()} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default observer(App);

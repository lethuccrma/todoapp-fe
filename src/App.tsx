import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import TodoList from './pages/TodoList';
import { persistor, store } from './redux/store';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useSelector } from 'react-redux';
import { AuthState } from './redux/auth/auth.slice';
import './index.css';

function Router() {
  const navigate = useNavigate();
  const authState = useSelector<{auth: AuthState}, AuthState>((state) => state.auth);
  console.log(authState);

  useEffect(() => {
    if (!authState.authenticated) {
      navigate('/login');
    }
  }, [authState.authenticated])
  return (
    <Routes>
      <Route path="/" element={<TodoList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
}

export default App;

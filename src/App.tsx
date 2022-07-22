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
import User from './pages/User';
import { useDispatch } from 'react-redux';
import { FETCH_USER } from './redux/user/user.saga';

function Router() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector<{auth: AuthState}, AuthState>((state) => state.auth);

  useEffect(() => {
    if (!authState.authenticated && window.location.pathname !== '/signup') {
      navigate('/login');
    }
    if (authState.authenticated) {
      dispatch(FETCH_USER());
    }
  }, [authState.authenticated])
  return (
    <Routes>
      <Route path="/" element={<TodoList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user" element={<User />} />
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

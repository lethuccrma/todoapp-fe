import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import TodoList from './pages/TodoList';
import { persistor, store } from './redux/store';
import Login from './pages/Login';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;

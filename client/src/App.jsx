import React from 'react';
import { useRoutes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import CreateDraft from './pages/CreateDraft';
import EditDraft from './pages/EditDraft';
import './App.css';

const App = () => {
  let element = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/draft/new', element: <CreateDraft /> },
    { path: '/draft/:id/edit', element: <EditDraft /> },
  ]);

  return (
    <div className="app">
      <Navigation />
      {element}
    </div>
  );
};

export default App;

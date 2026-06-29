import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navigation.css';

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <Link to="/">LoL Draft Sim</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/draft/new">New Draft</Link>
      </div>
    </nav>
  );
};

export default Navigation;

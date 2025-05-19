// ThemeToggle.js
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
    </button>
  );
}

export default ThemeToggle;

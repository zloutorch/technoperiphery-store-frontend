import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} title="Переключить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;

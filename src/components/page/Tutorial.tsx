import React from 'react';
import logo from '../../logo.svg';
import Counter from '../../features/counter/Counter';
import './Tutorial.css';

function Tutorial(): JSX.Element {
  return (
    <div className="Tutorial">
      <header className="Tutorial-header">
        <img src={logo} className="Tutorial-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/Tutorial.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="Tutorial-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer">
            React
          </a>
          <span>, </span>
          <a
            className="Tutorial-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer">
            Redux
          </a>
          <span>, </span>
          <a
            className="Tutorial-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer">
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="Tutorial-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer">
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default Tutorial;

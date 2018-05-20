import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import PollForm from './components/PollForm';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <img src={logo} alt="Maju Poll Logo"/>
          <h1>maju</h1>
        </header>
        <PollForm />
      </div>
    );
  }
}

export default App;

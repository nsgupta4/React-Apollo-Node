import React, { Component } from 'react';
import Book from './containers/book';
import Toolbar from './containers/toolbar';
import './App.css';
import AddBook from './containers/addBook';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <AddBook />
        <Book />
      </div>
    );
  }
}

export default App;

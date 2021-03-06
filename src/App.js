import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import SimplePDF from './PDF'

class App extends Component {
  render() {
    return (
      <div className="App">
        <SimplePDF ref="pdf"/>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <button onClick={this.handleClick.bind(this)}>Generate PDF</button>
        </p>
      </div>
    )
  }

  handleClick(){
    this.refs.pdf.generatePDF()
  }
}

export default App

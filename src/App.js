import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import SimplePDF from './PDF'
import SimplePDFContext from './PDFWithContext'

class App extends Component {
  render() {
    return (
      <div className="App">
        <SimplePDF ref="pdf"/>
        <SimplePDFContext ref="pdf"/>
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
    console.log(this.refs.pdf.getJSON())
  }
}

export default App

import React from 'react'
import { omit } from 'lodash/fp'
import * as PDFComponents from '../PDF/components'

function createComponent(name, renderer){
  const component = class extends React.Component {
    static displayName = name

    static contextTypes = {
      pdfChildren: React.PropTypes.array.isRequired,
    }

    static childContextTypes = {
      pdfChildren: React.PropTypes.array,
    }

    constructor(props){
      super(props)
      this.pdfChildren = []
    }

    getChildContext(){
      return { pdfChildren: this.pdfChildren }
    }

    componentDidMount(){
      const children = typeof this.props.children === 'string' ? this.props.children : this.pdfChildren
      this.node = renderer(children, omit('children', this.props))
      this.context.pdfChildren.push(this.node)
    }

    render(){
      return <div>{this.props.children}</div>
    }
  }

  return component
}

const Text = createComponent('Text', PDFComponents.Text)
const Row = createComponent('Row', PDFComponents.Row)
const Grid = createComponent('Grid', PDFComponents.Grid)

class ContextPDF extends React.Component {
  static childContextTypes = {
    pdfChildren: React.PropTypes.array,
  }
  constructor(props){
    super(props)
    this.pdfChildren = []
  }
  getChildContext(){
    return { pdfChildren: this.pdfChildren }
  }
  render(){
    return <div>{this.props.children}</div>
  }
}

export default class SimplePDFContext extends React.Component {
  getJSON(){
    return this.refs.pdf.pdfChildren
  }
  render(){
    return (
      <ContextPDF ref="pdf">
        <Grid>
          <Row>
            <Text>Row 1</Text>
          </Row>
          <Row>
            <Text>Row 2</Text>
          </Row>
        </Grid>
      </ContextPDF>
    )
  }
}

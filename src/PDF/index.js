import React from 'react'
import 'pdfmake/build/pdfmake.js'
import 'pdfmake/build/vfs_fonts.js'

import {
  PDF,
  Row,
  Text,
  PageBreaker,
  Grid,
} from './apiComponents'

export default class SimplePDF extends React.Component {
  getDocDef(){
    return this.refs.pdf.node.render()
  }

  generatePDF(){
    const def = this.getDocDef().map(x => ({...x}))
    console.log(this.getDocDef())
    window.pdfMake.createPdf({content: def}).open()
  }

  render(){
    return (
      <PDF ref="pdf">
        <Grid widths={['*']}>
          <Row>
            <Text
              text="Row 1"
              bold
            />
          </Row>

          <Row>
            <Text
              text="Row 2"
            />
          </Row>
        </Grid>

        <PageBreaker />

        <Grid>
          <Row><Text text="Grid 2"/></Row>
        </Grid>
      </PDF>
    )
  }
}

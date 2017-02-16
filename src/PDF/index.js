import React from 'react'
import 'pdfmake/build/pdfmake.js'
import 'pdfmake/build/vfs_fonts.js'

import {
  PDF,
  Row,
  Text,
  PageBreaker,
  Grid,
  Stack,
  Columns,
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
            <Stack>
              <Text bold>
                Row 1
              </Text>
              <Text>Stacked text</Text>
            </Stack>
          </Row>

          <Row>
            <Text>Row 2</Text>
          </Row>
        </Grid>

        <PageBreaker />

        <Grid>
          <Row>
            <Columns>
              <Text>Grid 2</Text>
              <Text>Column text</Text>
            </Columns>
          </Row>
        </Grid>
      </PDF>
    )
  }
}

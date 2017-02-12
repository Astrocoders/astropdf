astropdf
========

pdfMake and React components experiment.
Heavily inspired in https://goshakkk.name/react-custom-renderers/.
Special thanks to @goshakkk.

A sneak peak into what you can do:
```js
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
              <Text
                text="Row 1"
                bold
              />
              <Text
                text="Stacked text"
                bold
              />
            </Stack>
          </Row>

          <Row>
            <Text
              text="Row 2"
            />
          </Row>
        </Grid>

        <PageBreaker />

        <Grid>
          <Row>
            <Columns>
              <Text text="Grid 2"/>
              <Text text="Column text"/>
            </Columns>
          </Row>
        </Grid>
      </PDF>
    )
  }
}
```

## Why?
pdfMake is a great tool for generating PDFs in JS. Though a JSON structure is very useful,
it can get really messy when the PDF structures grows bigger and gets more complex. And that's
where React comes in to help, the easy JSX structure is great to abstract the most complex
structures into the so called and amazing components.

TODO
- [] Create propTypes checking
- [] Make code more clean

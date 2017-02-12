import _ from 'lodash'

export const Text = ({ text, ...props}) => ({ ...props, text })
export const BoldText = ({ text, ...props}) => ({ ...props, bold: true, text })
export const Stack = (children, props = {}) => ({ ...props, stack: children })
export const Grid = (children, props = {}) => ({
  colSpan: props.colSpan,
  table: {
    ...props,
    body: _.compact([
      ...children,
    ]),
  },
})
export const Row = (children) => ([
  ...children,
])

export const PageBreaker = () => ({
  text: '',
  fontSize: 1,
  pageBreak: 'after'
})

export const Columns = (children, props = {}) => ({
  ...props,
  columns: children,
})

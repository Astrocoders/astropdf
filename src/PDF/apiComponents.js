import React from 'react'
import ReactUpdates from 'react-dom/lib/ReactUpdates'
import ReactMultiChild from 'react-dom/lib/ReactMultiChild'
import ReactInstanceMap from 'react-dom/lib/ReactInstanceMap'

import * as PDFComponents from './components'

import { Surface, Primitive, Group } from './api'

const createComponent = (name, ...mixins) => {
  function C(element) {
    this.node = null
    this.subscriptions = null
    this.listeners = null
    this._mountImage = null
    this._renderedChildren = null
    this._currentElement = null
    this.construct(element)
  }

  C.displayName = name

  mixins.forEach(mixin => Object.assign(C.prototype, mixin))

  return C
}

function injectAfter(parentNode, referenceNode, node) {
  if (!referenceNode) {
    parentNode.insertFirst(node)
  } else {
    parentNode.insertAfter(referenceNode, node)
  }
}

const ContainerMixin = Object.assign({}, ReactMultiChild.Mixin, {
  moveChild(child, afterNode, toIndex, lastIndex) {
    const childNode = child._mountImage
    injectAfter(this.node, afterNode, childNode)
  },

  createChild(child, afterNode, childNode) {
    child._mountImage = childNode
    injectAfter(this.node, afterNode, childNode)
  },

  removeChild(child) {
    const childNode = child._mountImage
    child._mountImage = null
    this.node.ejectChild(childNode)
  },

  updateChildrenAtRoot(nextChildren, transaction) {
    this.updateChildren(nextChildren, transaction, {})
  },

  mountAndInjectChildrenAtRoot(children, transaction) {
    this.mountAndInjectChildren(children, transaction, {})
  },

  updateChildren(nextChildren, transaction, context) {
    this._updateChildren(nextChildren, transaction, context)
  },

  mountAndInjectChildren(children, transaction, context) {
    const mountedImages = this.mountChildren(
      children,
      transaction,
      context
    )
    let i = 0
    for (let key in this._renderedChildren) {
      if (this._renderedChildren.hasOwnProperty(key)) {
        const child = this._renderedChildren[key]
        child._mountImage = mountedImages[i]
        injectAfter(this.node, mountedImages[i - 1], mountedImages[i])
        i++
      }
    }
  },
  receiveComponent(nextComponent, transaction, context) {
    this.applyNodeProps(this._currentElement.props, nextComponent.props)
    this.updateChildren(nextComponent.props.children, transaction, context)
    this._currentElement = nextComponent
  },

  unmountComponent() {
    this.unmountChildren()
  },

})

const NodeMixin = {
  construct(element) {
    this._currentElement = element
  },

  getNativeNode() {
    return this.node
  },

  getPublicInstance() {
    return this.node
  },

  applyNodeProps(oldProps, props) {
    const {node} = this
    node.setProps(props)
  }
}


const RenderableMixin = Object.assign({}, NodeMixin, {
  unmountComponent() {
  }
})

const createPrimitive = (name, renderFn) => {
  return createComponent(name, RenderableMixin, {
    mountComponent(transaction, nativeParent, nativeContainerInfo, context) {
      this.node = new Primitive(name, renderFn)
      this.applyNodeProps({}, this._currentElement.props)
      return this.node
    },

    receiveComponent(nextComponent, transaction, context) {
      this.applyNodeProps(this._currentElement.props, nextComponent.props)
      this._currentElement = nextComponent
    }
  })
}

const getCustomContainerMixin = renderFn => ({
  mountComponent(transaction, nativeParent, nativeContainerInfo, context) {
    this.node = new Group(renderFn)
    this.applyNodeProps({}, this._currentElement.props)
    this.mountAndInjectChildren(this._currentElement.props.children, transaction, context)
    return this.node
  },
})

export const Grid = createComponent(
  'Grid',
  NodeMixin,
  ContainerMixin,
  getCustomContainerMixin(PDFComponents.Grid)
)

export const Stack = createComponent(
  'Stack',
  NodeMixin,
  ContainerMixin,
  getCustomContainerMixin(PDFComponents.Stack)
)

export const Row = createComponent(
  'Row',
  NodeMixin,
  ContainerMixin,
  getCustomContainerMixin()
)

export const Columns = createComponent(
  'Columns',
  NodeMixin,
  ContainerMixin,
  getCustomContainerMixin(PDFComponents.Columns)
)

export const Text = createPrimitive('Text', PDFComponents.Text)
export const PageBreaker = createPrimitive('PageBreaker', PDFComponents.PageBreaker)
export const PDF = React.createClass({
  mixins: [ContainerMixin],

  componentDidMount() {
    try {
    this._debugID = this._reactInternalInstance._debugID
    this.node = new Surface(this)

    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
    transaction.perform(
      this.mountAndInjectChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    )
    ReactUpdates.ReactReconcileTransaction.release(transaction)

    } catch(e) { console.error(e) }
  },

  componentDidUpdate(oldProps) {
    try {
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
    transaction.perform(
      this.updateChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    )
    ReactUpdates.ReactReconcileTransaction.release(transaction)

    } catch(e) { console.error(e) }
  },

  render(){
    return <div></div>
  }
})

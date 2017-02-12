import { omit } from 'lodash/fp'

export class Node {
  constructor() {
    this._props = {}
    this.parentNode = null
  }

  setProps(props) {
    this._props = props
  }
}

export class Primitive extends Node {
  constructor(type, renderFn) {
    super()
    this.type = type
    this.renderFn = renderFn
  }

  toJSONDesc() {
    return this.renderFn(this._props)
  }
}

export class Group extends Node {
  constructor(wrapper = x => x) {
    super();
    this._children = [];
    this.JSONDescWrapper = wrapper
  }

  exists(node) {
    return this._children.indexOf(node) !== -1;
  }

  insertFirst(node) {
    if (this.exists(node)) return;
    node.parentNode = this;
    this._children.unshift(node);
  }

  insertAfter(referenceNode, node) {
    const index = this._children.indexOf(node);
    const exists = index !== -1;
    const refIndex = this._children.indexOf(referenceNode);
    if (exists) {
      // move
      this._children.splice(refIndex + 1, 0, this._children.splice(index, 1)[0]);
    } else {
      // insert
      node.parentNode = this;
      this._children.splice(refIndex + 1, 0, node);
    }
  }

  ejectChild(node) {
    const index = this._children.indexOf(node);
    this._children.splice(index, 1);
    node.parentNode = null;
  }

  toJSONDesc() {
    return this.JSONDescWrapper(this._children.map(x => x.toJSONDesc()), omit('children', this._props))
  }
}

export class Surface extends Group {
  constructor(node){
    super()
    this.node = node
  }

  render(){
    return this.toJSONDesc()
  }

  toJSONDesc() {
    return this._children.map(x => x.toJSONDesc())
  }
}

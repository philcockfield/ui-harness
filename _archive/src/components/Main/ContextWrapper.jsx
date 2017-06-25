import { Component } from 'react';

import { PropTypes } from '../util';

const { object, node } = PropTypes;

class ContextWrapper extends Component {
  static propTypes = {
    context: object,
    children: node.isRequired,
  }
  getChildContext = () => this.props.context
  render() { return this.props.children || null; }
}

export default ContextWrapper;

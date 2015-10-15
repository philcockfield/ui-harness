import React from "react";


/**
 * Dummy component.
 */
export default class MyComponent extends React.Component {
  render() {
    return (
      <div style={{
          background: this.props.color,
          color: "white",
          padding: 40 }}>
        MyComponent
      </div>
    );
  }
}


// API --------------------------------------------------------
MyComponent.propTypes = {
  color: React.PropTypes.oneOf(["red", "green", "blue"]),
};
MyComponent.defaultProps = {
  color: "blue"
};

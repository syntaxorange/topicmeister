import React from "react";

export default class GetTextarea extends React.Component {
  render() {
    return (
      <textarea 
        className={this.props.class}
        onChange={this.props.onChange}
      />
    )
  }
}
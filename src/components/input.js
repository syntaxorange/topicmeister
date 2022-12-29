import React from "react";

export default class GetInput extends React.Component {
  render() {
    return (
      <input 
        type="text"
        className={this.props.class}
        onChange={this.props.onChange}
        value={this.props.value}
        defaultValue={this.props.defaultValue}
      />
    )
  }
}
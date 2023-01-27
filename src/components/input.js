import React from "react";

export default class GetInput extends React.Component {
  render() {
    return (
      <input 
        type="text"
        id={this.props.id}
        className={this.props.class}
        onChange={this.props.onChange}
        onKeyUp={this.props.onKeyUp}
        value={this.props.value}
        defaultValue={this.props.defaultValue}
      />
    )
  }
}
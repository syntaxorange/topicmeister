import React from "react";

export default class GetButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.data);
  }

  render() {
    return (
      <button 
        className={`button ${this.props.class ? this.props.class : ''}`}
        onClick={this.handleClick}
      >
        {this.props.text}
        {this.props.children}
      </button>
    );
  }
}
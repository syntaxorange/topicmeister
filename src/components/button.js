import React from "react";

export default class GetButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTooltip: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick() {
    if (this.props.onClick)
      this.props.onClick(this.props.data);
  }

  handleMouseEnter() {
    this.setState({isShowTooltip: true});
  }

  handleMouseLeave() {
    this.setState({isShowTooltip: false});
  }

  render() {
    return (
      <button 
        id={this.props.id}
        className={`button ${this.props.class ? this.props.class : ''}`}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.text}
        {this.props.children}
        {+this.props.tooltip >= 0 && <span className="tooltip" style={{display: `${this.state.isShowTooltip ? 'block' : ''}`}}>{this.props.tooltip}</span>}
      </button>
    );
  }
}
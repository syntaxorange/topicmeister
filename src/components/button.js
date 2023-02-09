import React from "react";
import './button.css';

export default class GetButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTooltip: false
    }
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
        onClick={this.handleClick.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        {this.props.text}
        {this.props.children}
        {+this.props.tooltip >= 0 && <span className="tooltip" style={{display: `${this.state.isShowTooltip ? 'block' : ''}`}}>{this.props.tooltip}</span>}
      </button>
    );
  }
}
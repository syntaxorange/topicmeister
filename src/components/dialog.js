import React from 'react';
import './dialog.css';

export default class GetDialog extends React.Component {
  constructor(props) {
    super(props);
  }
  
  handleDeclineClick() {
    this.props.onClick('decline');
  }
  
  handleAcceptClick() {
    this.props.onClick('accept');
  }

  render() {
    return (
      <div className="dialog">
        <div>
          <div className="dialog-header">
            <div className="dialog-title">{this.props.title}</div>
            <span className="dialog-close material-icons material-icons-outlined" onClick={this.handleDeclineClick.bind(this)}>close</span>
          </div>
          <div className="dialog-content">
            {this.props.content}
          </div>
        </div>
        <div className="dialog-buttons">
          <button className="dialog-button" onClick={this.handleDeclineClick.bind(this)}>{this.props.decline}</button>
          <button className="dialog-button" onClick={this.handleAcceptClick.bind(this)}>{this.props.accept}</button>
        </div>
      </div>
    )
  }
}
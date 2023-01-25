import React from "react";
import GetButton from "./components/button";

export default class Title extends React.Component {
  render() {
    return (
      <div className="title">
        {this.props.isOpenConcepts &&
          <GetButton class="button-arrow" onClick={this.props.toggleOpenConcepts}>
            <span className="material-icons">keyboard_arrow_left</span>
          </GetButton>
        }
        <span>{this.props.currentTitle}</span>
      </div>
    );
  }
}
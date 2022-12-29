import React from "react";
import GetButton from "./components/button";
import GetDropdown from "./components/dropdown";

export default class Concept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFull: false,
      dropdownItems: [
        { name: 'Change concept', tmp: 'Cancel change', type: 'change' }, 
        { name: 'Remove concept', tmp: 'Cancel remove', type: 'remove' }
      ]
    }
  }

  renderConcept() {
    return (
      <div key={this.props.concept.id} className="concept">
        <div className="concept-header">
          <div className="concept-title">{this.props.concept.title}</div>
          <div className="concept-icons">
            <GetButton>
              <span className="material-icons md-18 md-106">play_circle_outline</span>
            </GetButton>
            <GetButton class="button-no-pointer" tooltip={this.props.concept.views}>
              <span className="material-icons md-18 md-148">remove_red_eye</span>
            </GetButton>
            <GetDropdown items={this.state.dropdownItems} iconClass="md-18" onClick={() => {}}/>
          </div>
        </div>
        <div className="concept-content" style={{height: this.state.isShowFull ? '100%' : ''}}>
          {this.props.concept.content}
        </div>
        <div className="concept-footer">
          <GetButton class="fullscreen" onClick={() => this.setState({isShowFull: !this.state.isShowFull})}>
            <span className="material-icons md-141">{this.state.isShowFull ? 'fullscreen_exit' : 'fullscreen'}</span>
          </GetButton>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderConcept()}
      </>
    )
  }
}
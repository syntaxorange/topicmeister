import React from "react";
import GetButton from "./components/button";
import GetInput from "./components/input";
import GetTextarea from "./components/textarea";

export default class NewConcept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleAddConceptClick = this.handleAddConceptClick.bind(this);
  }
  
  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim()
    });
  }

  handleContentChange(e) {
    this.setState({
      content: e.target.value.trim()
    });
  }

  handleAddConceptClick() {
    if (!this.state.title || !this.state.content)
      return;
    this.props.onAddConceptApply({...this.state});
  }

  render() {
    return (
      <div className="new-concept">
        <GetInput class="new-concept-input" onChange={this.handleTitleChange}/>
        <GetTextarea class="new-concept-content" onChange={this.handleContentChange}/>
        <div className="new-concept-footer">
          <GetButton class="new-concept-add" onClick={this.handleAddConceptClick}>
            <span className="material-icons md-18">add_box</span>
          </GetButton>
        </div>
      </div>
    )
  }  
}
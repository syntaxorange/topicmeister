import React from "react";
import GetButton from "./components/button";
import GetInput from "./components/input";
import GetLabel from "./components/label";
import GetTextarea from "./components/textarea";

export default class NewConcept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      labels: []
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleAddConceptClick = this.handleAddConceptClick.bind(this);
    this.handleChangeLabels = this.handleChangeLabels.bind(this);
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

  handleChangeLabels(labels) {
    this.setState({
      labels
    });
  }

  render() {
    return (
      <div className="new-concept">
        <GetInput class="new-concept-input" onChange={this.handleTitleChange}/>
        <GetTextarea class="new-concept-content" onChange={this.handleContentChange}/>
        <div className="new-concept-footer">
          <GetLabel onChangeLabel={this.handleChangeLabels} isShowDynamically={true} />
          <GetButton class="new-concept-add" onClick={this.handleAddConceptClick}>
            <span className="material-icons md-18">add_box</span>
          </GetButton>
        </div>
      </div>
    )
  }  
}
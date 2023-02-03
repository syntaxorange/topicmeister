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
    this.labelRef = React.createRef();
    this.inputRef = React.createRef();
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleAddConceptClick = this.handleAddConceptClick.bind(this);
    this.handleChangeLabels = this.handleChangeLabels.bind(this);
  }
  
  focusInput() {
    this.inputRef.current.focusInput();
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleContentChange(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleAddConceptClick() {
    if (!this.state.title || !this.state.content)
      return;
    this.props.onAddConceptApply({...this.state});
    this.setState({
      title: '',
      content: '',
      labels: []
    }, () => {
      this.labelRef.current.resetLabels(this.state.labels);
    });
  }

  handleChangeLabels(labels) {
    this.setState({
      labels
    });
  }

  render() {
    return (
      <div className="new-concept">
        <GetInput ref={this.inputRef} class="new-concept-input" onChange={this.handleTitleChange} value={this.state.title}/>
        <GetTextarea class="new-concept-content" onChange={this.handleContentChange} value={this.state.content}/>
        <div className="new-concept-footer">
          <GetLabel ref={this.labelRef} onChangeLabel={this.handleChangeLabels} isShowDynamically={true} defaultLabels={this.state.labels}/>
          <GetButton class="new-concept-add" onClick={this.handleAddConceptClick}>
            <span className="material-icons md-18">add_box</span>
          </GetButton>
        </div>
      </div>
    )
  }  
}
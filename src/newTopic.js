import React from "react";
import GetButton from "./components/button";
import GetInput from "./components/input";

export default class NewTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
    this.newTopicInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      if (e.key === 'Enter' && this.state.name)
        this.handleApplyAddTopicClick();
    });
  }

  resetName() {
    this.setState({ name: '' });
  }

  focusInput() {
    this.newTopicInput.current.focusInput();
  }

  handleAddTopicInputChange(e) {
    this.setState({
      name: e.target.value.trim()
    });
  }

  handleApplyAddTopicClick() {
    if (this.state.name)
      this.props.onApplyAddTopicClick(this.state.name);
  }

  render() {
    return (
      <GetButton class="topic">
        <GetInput ref={this.newTopicInput} class="topic-input" value={this.state.name} onChange={this.handleAddTopicInputChange.bind(this)} />
        <span className="material-icons material-icons-outlined" onClick={this.handleApplyAddTopicClick.bind(this)}>add_box</span>
      </GetButton>
    );
  }
}
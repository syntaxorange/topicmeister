import React from "react";
import GetButton from "./components/button";
import GetInput from "./components/input";

export default class NewTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
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
        <GetInput class="topic-input" value={this.state.name} onChange={this.handleAddTopicInputChange.bind(this)} />
        <span className="material-icons material-icons-outlined" onClick={this.handleApplyAddTopicClick.bind(this)}>add_box</span>
      </GetButton>
    );
  }
}
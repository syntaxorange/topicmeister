import React from "react";
import GetButton from "./components/button";
import GetInput from "./components/input";

export default class Topic extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      const target = e.target;

      if (e.key === 'Enter' && target.classList.contains('topic-input'))
        this.handleTopicIconClick('change', +target.parentNode.id);
    });
  }

  getTopicType() {
    let type = '';
    if (this.props.isRemoveTopics) {
      type = 'remove';
    } else if (this.props.isChangeTopics) {
      type = 'change';
    } else {
      type = 'open';
    }

    return type;
  }

  getTopicIconType({ change, remove }) {
    let iconType = '';

    if (change) {
      iconType = 'edit_note';
    } else if (remove) {
      iconType = 'remove_circle_outline';
    } else {
      iconType = 'keyboard_arrow_right';
    }

    return iconType;
  }

  handleTopicInputChange(id, e) {
    this.props.onTopicInputChange(id, e);
  }

  handleTopicIconClick(type, id) {
    switch (type) {
      case 'change':
        this.props.onChangeTopicClick(id);
        break;
      case 'remove':
        this.props.onRemoveTopicClick(id);
        break;
      case 'open':
        this.props.onOpenTopicClick(id);
        break;
      default:
    }
  }

  renderTopic() {
    const topic = this.props.topic;
    const topicType = this.getTopicType();
    const iconType = this.getTopicIconType(topic);

    return (
      <GetButton key={topic.id} class="topic" id={topic.id} data={topicType} text={topic.change ? '' : topic.name}
        onClick={() => topicType === 'open' && this.handleTopicIconClick(topicType, topic.id)}
      >
        {topic.change &&
          <GetInput class="topic-input" defaultValue={topic.name} onChange={this.handleTopicInputChange.bind(this, topic.id)} />
        }
        <span className={`material-icons ${topic.remove ? ' md-22' : ''}`} onClick={() => this.handleTopicIconClick(topicType, topic.id)}>{iconType}</span>
      </GetButton>
    )   
  }

  render() {
    return (
      <>
        {this.renderTopic()}
      </>
    )
  }
}
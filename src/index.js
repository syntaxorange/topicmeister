import React from "react";
import ReactDOM from "react-dom/client";
import GetButton from "./components/button";
import GetDropdown from "./components/dropdown";
import GetInput from "./components/input";
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTopic: false,
      isRemoveTopics: false,
      isChangeTopics: false,
      newTopicName: '',
      topics: [
        { id: 1, name: 'React', change: false }, 
        { id: 2, name: 'Angular', change: false },
        { id: 3, name: 'Vue', change: false }, 
        { id: 4, name: 'JavaScript', change: false }, 
        { id: 5, name: 'Css', change: false }, 
        { id: 6, name: 'Html', change: false }
      ],
      dropdownItems: [
        { name: 'Add topic', tmp: 'Cancel add', type: 'add' }, 
        { name: 'Change topic', tmp: 'Cancel change', type: 'change' }, 
        { name: 'Remove topic', tmp: 'Cancel remove', type: 'remove' }
      ],
      topicsChanged: []
    }
    this.handleControlTopicClick = this.handleControlTopicClick.bind(this);
    this.handleApplyTopicClick = this.handleApplyTopicClick.bind(this);
    this.handleAddTopicInputChange = this.handleAddTopicInputChange.bind(this);
    this.handleTopicInputChange = this.handleTopicInputChange.bind(this);
    this.handleTopicIconClick = this.handleTopicIconClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      const target = e.target;
      
      if (e.key === 'Enter') {
        if (this.state.newTopicName)
          this.handleApplyTopicClick();
        if (target.classList.contains('topic-input'))
          this.handleTopicIconClick('change', +target.parentNode.id);
      }
    });
  }

  getTopicById(topics, id) {
    return topics.find(o => o.id === id);
  }

  renderTopics() {
    let type = '';

    if (this.state.isRemoveTopics) {
      type = 'remove';
    } else if (this.state.isChangeTopics) {
      type = 'change';
    } else {
      type = 'open';
    }
    
    return (
      this.state.topics.map((o, i) => {
        let iconType = '';
        if (o.change) {
          iconType = 'edit_note';
        } else if (o.remove) {
          iconType = 'remove_circle_outline';
        } else {
          iconType = 'keyboard_arrow_right';
        }

        return (
          <GetButton key={o.id} class="topic" id={o.id} data={type} text={o.change ? '' : o.name}>
            {o.change && 
              <GetInput defaultValue={o.name} onChange={e => this.handleTopicInputChange(e, o.id)} />
            }
            <span className="material-icons material-icons-outlined" onClick={() => this.handleTopicIconClick(type, o.id)}>{iconType}</span>
          </GetButton>
        )
      })
    );
  }

  renderAddTopic() {
    if (this.state.isAddTopic) {
      return (
        <GetButton class="topic">
          <GetInput value={this.state.newTopicName} onChange={this.handleAddTopicInputChange} />
          <span className="material-icons material-icons-outlined" onClick={this.handleApplyTopicClick}>add_box</span>
        </GetButton>
      );
    }
  }

  handleAddTopicInputChange(e) {
    this.setState({
      newTopicName: e.target.value
    });
  }

  handleTopicInputChange(e, id) {
    const topics = structuredClone(this.state.topics);
    this.getTopicById(topics, id).name = e.target.value

    this.setState({
      topicsChanged: structuredClone(topics)
    });
  }

  focusInput() {
    const topicInput = document.querySelector('.topic-input');
          
    if (topicInput) {
      topicInput.setSelectionRange(0, 0);
      topicInput.focus();
    }
  }

  reverseNameDropdown(i) {
    const dropdownItems = structuredClone(this.state.dropdownItems);
        
    dropdownItems[i].name = dropdownItems[i].tmp;
    dropdownItems[i].tmp = this.state.dropdownItems[i].name;

    return dropdownItems;
  }

  handleControlTopicClick(type) {
    switch(type) {
      case 'add':
        const dropdownItemsAdd = this.reverseNameDropdown(0);

        this.setState({
          isAddTopic: !this.state.isAddTopic,
          newTopicName: '',
          dropdownItems: dropdownItemsAdd
        }, () => {
          if (this.state.isAddTopic)
            this.focusInput();
        });
        break;
      case 'change':
        const topics = structuredClone(this.state.topics);
        topics.forEach(o => o.change = !this.state.isChangeTopics);
        const dropdownItemsChange = this.reverseNameDropdown(1);
        
        this.setState({
          isChangeTopics: !this.state.isChangeTopics,
          dropdownItems: dropdownItemsChange,
          topics,
        }, () => {
          this.focusInput();
        });
        break;
      case 'remove':
        this.setState({
          isRemoveTopics: !this.state.isRemoveTopics
        });
        break;
      default:
    }
  }

  handleTopicIconClick(type, id) {
    switch (type) {
      case 'change':
        const topicsChanged = structuredClone(this.state.topicsChanged);
        if (!topicsChanged.length)
          return;
        const topicChanged = this.getTopicById(topicsChanged, id);
        topicChanged.change = false;
        const topics = structuredClone(this.state.topics);
        const topic = this.getTopicById(topics, id);
        topic.name = topicChanged.name;
        topic.change = false;
        this.setState({topics, topicsChanged});
        break;
    }
  }

  handleApplyTopicClick() {
    const newTopicName = this.state.newTopicName;
    let topics = structuredClone(this.state.topics);

    if (!newTopicName || topics.some(v => v.name === newTopicName)) {
      return;
    }

    topics.unshift({ id: 1, name: newTopicName, change: false });
    topics.forEach((o, i) => o.id = i + 1);

    this.setState({
      topics,
      newTopicName: ''
    });
  }

  render() {
    return (
      <div className="topic-meister">
        <div className="top">
          <div className="title">Topic Meister</div>
          <div className="top-icons">
            <GetDropdown 
              items={this.state.dropdownItems}
              onClick={this.handleControlTopicClick}/>
            <GetButton class="add" onClick={() => this.handleControlTopicClick('add')}>
              <span className="material-symbols-outlined">add</span>
            </GetButton>
          </div>
        </div>
        {this.renderAddTopic()}
        {this.renderTopics()}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
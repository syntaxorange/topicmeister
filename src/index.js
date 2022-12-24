import React from "react";
import ReactDOM from "react-dom/client";
import './style.css';

class GetButton extends React.Component {
  render() {
    return (
      <button 
        className={`button ${this.props.class ? this.props.class : ''}`}
        onClick={this.props.onClick}
        >
        {this.props.text}
        {this.props.children}
      </button>
    );
  }
}

class GetDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }
  
  componentDidMount() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown'))
        this.setState({ isActive: false });
    });
  }

  handleClick() {
    this.setState({ isActive: !this.state.isActive });
  }

  handleItemClick() {
    this.props.onClick();
    this.handleClick();
  }

  render() {
    return (
      <div className="dropdown">
        <GetButton class="more-vert" onClick={this.handleClick}>
          <span className="material-icons material-icons-outlined">more_vert</span>
        </GetButton>
        <div className={`dropdown-content${this.state.isActive ? ' active' : ''}`}>
          {this.props.items.map(item => { 
            return <GetButton class="button-dropdown" text={item} onClick={this.handleItemClick}/>
          })}
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTopic: false,
      currentTopic: '',
      topics: ['React', 'Angular', 'Vue', 'JavaScript', 'Css', 'Html']
    }
    this.handleAddTopicClick = this.handleAddTopicClick.bind(this);
    this.handleApplyTopicClick = this.handleApplyTopicClick.bind(this);
    this.handleTopicInputChange = this.handleTopicInputChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      if (e.key === 'Enter' && this.state.currentTopic)
        this.handleApplyTopicClick();
    });
  }

  renderTopics() {
    return (
      this.state.topics.map((value, index) => {
        return (
          <GetButton key={index} class="topic" text={value}>
            <span className="material-icons material-icons-outlined">keyboard_arrow_right</span>
          </GetButton>
        )
      })
    );
  }

  renderAddTopic() {
    if (this.state.isAddTopic) {
      return (
        <GetButton class="topic">
          <input 
            type="text" 
            className="topic-input" 
            onChange={this.handleTopicInputChange}
            value={this.state.currentTopic}
          />
          <span className="material-icons material-icons-outlined" onClick={this.handleApplyTopicClick}>add_box</span>
        </GetButton>
      );
    }
  }

  handleTopicInputChange(e) {
    this.setState({
      currentTopic: e.target.value
    });
  }

  handleAddTopicClick() {
    this.setState({
      isAddTopic: !this.state.isAddTopic,
      currentTopic: ''
    }, () => {
      if (this.state.isAddTopic)
        document.querySelector('.topic-input').focus();
    });
  }

  handleApplyTopicClick() {
    const currentTopic = this.state.currentTopic;
    const topics = this.state.topics;

    if (!currentTopic || topics.some(v => v === currentTopic)) {
      return;
    }

    this.setState({
      topics: [currentTopic, ...topics],
      currentTopic: ''
    });
  }

  render() {
    return (
      <div className="topic-meister">
        <div className="top">
          <div className="title">Topic Meister</div>
          <div className="top-icons">
            <GetDropdown 
              items={['Add topic', 'Change topic', 'Remove topic']}
              onClick={this.handleAddTopicClick}/>
            <GetButton class="add" onClick={this.handleAddTopicClick}>
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
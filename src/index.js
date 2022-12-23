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

  render() {
    return (
      <div className="dropdown">
        <GetButton class="more-vert" onClick={this.handleClick}>
          <span className="material-icons material-icons-outlined">more_vert</span>
        </GetButton>
        <div className={`dropdown-content${this.state.isActive ? ' active' : ''}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTopics() {
    const names = ['React', 'Angular', 'Vue', 'JavaScript', 'Css', 'Html'];

    return (
      names.map((value, index) => {
        return (
          <GetButton key={index} class="topic" text={value}>
            <span className="material-icons material-icons-outlined">keyboard_arrow_right</span>
          </GetButton>
        )
      })
    );
  }

  render() {
    return (
      <div className="topic-meister">
        <div className="top">
          <div className="title">Topic Meister</div>
          <div className="top-icons">
            <GetDropdown>
              <GetButton class="button-dropdown" text="Add topic"/>
              <GetButton class="button-dropdown" text="Change topic"/>
              <GetButton class="button-dropdown" text="Remove topic"/>
            </GetDropdown>
            <GetButton class="add">
              <span className="material-symbols-outlined">add</span>
            </GetButton>
          </div>
        </div>
        {this.renderTopics()}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
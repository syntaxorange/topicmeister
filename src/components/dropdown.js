import React from "react";
import GetButton from "./button";

export default class GetDropdown extends React.Component {
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

  handleItemClick(data) {
    this.props.onClick(data);
    this.handleClick();
  }

  renderItems() {
    return (
      <div className={`dropdown-content${this.state.isActive ? ' active' : ''}`}>
        {this.props.items.map((item, index) => {
          return <GetButton 
                   key={index}
                   class="button-dropdown" 
                   text={item.name} 
                   data={item.type} 
                   onClick={this.handleItemClick}/>
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="dropdown">
        <GetButton class="more-vert" onClick={this.handleClick}>
          <span className="material-icons material-icons-outlined">more_vert</span>
        </GetButton>
        {this.renderItems()}
      </div>
    );
  }
}
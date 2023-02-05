import React from "react";
import GetButton from "./button";

export default class GetDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };
  }
  
  componentDidMount() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown'))
        this.setState({ isActive: false });
    });
  }

  reverseNameDropdown(i) {
    const items = structuredClone(this.props.items);

    items[i].name = items[i].tmp;
    items[i].tmp = this.props.items[i].name;

    return items;
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
                   onClick={this.handleItemClick.bind(this)}/>
        })}
      </div>
    );
  }

  render() {
    return (
      <div className={`dropdown ${this.props.class || ''}`}>
        <GetButton onClick={this.handleClick.bind(this)}>
          <span className={`material-icons md-106 ${this.props.iconClass || ''}`}>more_vert</span>
        </GetButton>
        {this.renderItems()}
      </div>
    );
  }
}
import React from "react";
import GetButton from "./components/button";
import GetDropdown from "./components/dropdown";

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.handleControlTopicClick = this.handleControlTopicClick.bind(this);
  }

  handleControlTopicClick(type) {
    switch (type) {
      case 'add':
        this.props.onAddTopic();
        break;
      case 'change':
        this.props.onChangeTopics();
        break;
      case 'remove':
        this.props.onRemoveTopics();
        break;
      case 'add-concept':
        this.props.onAddConcept();
        break;
      case 'filter-concepts':
        this.props.onFilterConcepts();
        break;
      default:
    }
  }

  renderTopicTopIcons() {
    if (this.props.isOpenConcepts)
      return;

    return (
      <>
        <GetDropdown
          class="dropdown-margin"
          items={this.props.items}
          onClick={this.handleControlTopicClick} />
        <GetButton class="add" onClick={() => this.handleControlTopicClick('add')}>
          <span className="material-symbols-outlined">add</span>
        </GetButton>
      </>
    )
  }

  renderConceptTopIcons() {
    if (!this.props.isOpenConcepts)
      return;

    return (
      <>
        <GetButton>
          <span className="material-icons md-18 md-106">stop</span>
        </GetButton>
        <GetButton onClick={() => this.handleControlTopicClick('filter-concepts')}>
          <span className="material-icons md-18 md-106" style={{color: !this.props.isFilterDesc ? '#111111' : ''}}>filter_list</span>
        </GetButton>
        <GetButton class="add-concept" onClick={() => this.handleControlTopicClick('add-concept')}>
          <span className="material-icons md-18">add_comment</span>
        </GetButton>
      </>
    );
  }

  render() {
    return (
      <div className="top-icons">
        {this.renderTopicTopIcons()}
        {this.renderConceptTopIcons()}
      </div>
    );
  }
}
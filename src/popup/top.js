import React from "react";
import GetButton from "../components/button";
import GetDropdown from "../components/dropdown";

class Top extends React.Component {
  constructor(props) {
    super(props);
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
      case 'play':
        this.props.onClickConceptsPlay();
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
          ref={this.props.forwardedRef}
          class="dropdown-margin"
          items={this.props.dropdownItems}
          onClick={this.handleControlTopicClick.bind(this)} />
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
        <GetButton onClick={() => this.handleControlTopicClick('play')}>
          <span className="material-icons md-18 md-106">{this.props.isPlayAllConcepts ? 'stop' : 'play_circle_outline'}</span>
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

export default React.forwardRef((props, ref) => <Top forwardedRef={ref} {...props} />);
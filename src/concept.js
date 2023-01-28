import React from "react";
import GetButton from "./components/button";
import GetDropdown from "./components/dropdown";
import GetInput from "./components/input";
import GetLabel from "./components/label";
import GetTextarea from "./components/textarea";

export default class Concept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFull: false,
      isChangeConcept: false,
      title: '',
      content: '',
      labels: [],
      dropdownItems: [
        { name: 'Change concept', tmp: 'Cancel change', type: 'change' }, 
        { name: 'Remove concept', tmp: 'Cancel remove', type: 'remove' }
      ]
    }
    this.header = React.createRef();
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleControlConceptClick = this.handleControlConceptClick.bind(this);
    this.handleChangeLabels = this.handleChangeLabels.bind(this);
    this.handleToggleLabelActive = this.handleToggleLabelActive.bind(this);
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim()
    });
  }

  handleContentChange(e) {
    this.setState({
      content: e.target.value.trim()
    });
  }

  reverseNameDropdown(i) {
    const dropdownItems = structuredClone(this.state.dropdownItems);

    dropdownItems[i].name = dropdownItems[i].tmp;
    dropdownItems[i].tmp = this.state.dropdownItems[i].name;

    return dropdownItems;
  }

  handleControlConceptClick(type) {
    switch(type) {
      case 'change':
        this.setState({
          dropdownItems: this.reverseNameDropdown(0),
          isChangeConcept: !this.state.isChangeConcept
        }, () => {
          const inputTitle = this.header.current.querySelector('.new-concept-input');
          if (inputTitle)
            inputTitle.focus();
        });
        break;
      case 'remove':
        this.setState({
          dropdownItems: this.reverseNameDropdown(1),
          isChangeConcept: false
        });
        this.props.onRemoveConcept();
        break;
      case 'play':
        this.props.onClickConceptPlay(this.props.concept.id);
        break;
      default:
    }
  }

  handleChangeConceptClick() {
    const clonedConcept = structuredClone(this.props.concept);
    clonedConcept.title = this.state.title || clonedConcept.title;
    clonedConcept.content = this.state.content || clonedConcept.content; 
    clonedConcept.labels = this.state.labels || clonedConcept.labels;

    this.setState({
      isChangeConcept: false
    });
    this.props.onChangeConceptApply(clonedConcept);
  }

  handleChangeLabels(labels) {
    this.setState({
      labels
    });
  }

  handleToggleLabelActive(labels) {
    this.setState({
      labels
    }, () => {
      const clonedConcept = structuredClone(this.props.concept);
      
      clonedConcept.labels = structuredClone(this.state.labels);
      this.props.onToggleLabelActive(clonedConcept);
    });
  }

  renderConcept() {
    return (
      <div key={this.props.concept.id} className="concept">
        <div className="concept-header" ref={this.header}>
          {!this.state.isChangeConcept &&
            <div className="concept-title">{this.props.concept.title}</div>
          }
          {this.state.isChangeConcept &&
            <GetInput class="new-concept-input" onChange={this.handleTitleChange} defaultValue={this.props.concept.title}/>
          }
          <div className="concept-icons">
            <GetButton data="play" onClick={this.handleControlConceptClick}>
              <span className="material-icons md-18 md-106">{this.props.concept.play ? 'stop' : 'play_circle_outline'}</span>
            </GetButton>
            <GetButton class="button-no-pointer" tooltip={this.props.concept.views}>
              <span className="material-icons md-18 md-148">remove_red_eye</span>
            </GetButton>
            <GetDropdown items={this.state.dropdownItems} iconClass="md-18" onClick={this.handleControlConceptClick}/>
          </div>
        </div>
        {!this.state.isChangeConcept &&
          <div className="concept-content" style={{height: this.state.isShowFull ? '100%' : ''}}>
            {this.props.concept.content}
          </div>
        }
        {this.state.isChangeConcept &&
          <GetTextarea class="new-concept-content" onChange={this.handleContentChange} defaultValue={this.props.concept.content}/>
        }
        <div className="concept-footer">
          {!this.state.isChangeConcept &&
            <>
              <GetLabel onToggleLabelActive={this.handleToggleLabelActive} labels={this.props.concept.labels} isShowDynamically={false} />
              <GetButton class="fullscreen" onClick={() => this.setState({isShowFull: !this.state.isShowFull})}>
                <span className="material-icons md-141">{this.state.isShowFull ? 'fullscreen_exit' : 'fullscreen'}</span>
              </GetButton>
            </>
          }
          {this.state.isChangeConcept &&
            <>
              <GetLabel onChangeLabel={this.handleChangeLabels} labels={this.props.concept.labels} isShowDynamically={true} />
              <GetButton class="concept-apply" onClick={() => this.handleChangeConceptClick()}>
                <span className="material-icons md-141">edit_note</span>
              </GetButton>
            </>
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderConcept()}
      </>
    )
  }
}
import React from "react";
import GetButton from "./button";
import GetInput from "./input";

export default class GetLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: this.props.defaultLabels
    }
  }

  resetLabels(defaultLabels) {
    this.setState({
      labels: defaultLabels
    });
  }

  getLabelIndex(id) {
    const labels = structuredClone(this.state.labels);
    const index = labels.findIndex(label => label.id === id);

    return {
      labels,
      index
    }
  }

  addLabel() {
    const labels = structuredClone(this.state.labels);

    labels.push({
      id: labels.length + 1,
      label: 'label',
      change: false,
      active: false
    });

    this.setState({
      labels
    });
  }

  removeLabel(id) {
    const { labels, index } = this.getLabelIndex(id);

    labels.splice(index, 1);
    labels.forEach((o, i) => o.id = i + 1);
    this.setState({
      labels
    }, () => {
      this.props.onChangeLabel(structuredClone(this.state.labels));
    });
  }

  toggleChangeLabel(id, state, e) {
    const {labels, index } = this.getLabelIndex(id);
    const label = labels[index];

    if (!label.label)
      return;

    label.change = state;
    this.setState({
      labels 
    }, () => {
      if (state) {
        const input = document.getElementById(id);

        if (input) {
          input.setSelectionRange(0, 0);
          input.focus();
        }
      }
    });
  }

  changeLabel(id, e) {
    if (e.key === 'Enter') {
      this.toggleChangeLabel(id, false, e);

      return;
    }

    const { labels, index } = this.getLabelIndex(id);

    labels[index].label = e.target.value.trim().substr(0, 15);
    this.setState({
      labels 
    }, () => {
      const labels = structuredClone(this.state.labels);

      labels.forEach(o => o.change = false);
      this.props.onChangeLabel(labels);
    });
  }

  toggleLabelActive(id) {
    const { labels, index } = this.getLabelIndex(id);
    const labelObject = labels[index];
    
    labelObject.active = !labelObject.active;

    this.setState({
      labels,
    }, () => {
      if (this.props.onToggleLabelActive)
        this.props.onToggleLabelActive(structuredClone(this.state.labels));
    });
  }

  render() {
    return (
      <div class="labels">
        {this.props.isShowDynamically &&
          <>
            <GetButton class="label-add" onClick={this.addLabel.bind(this)}>
              <span class="material-icons md-16 label-add">add_circle_outline</span>
            </GetButton>
            {this.state.labels.map(o => (
              <GetButton class="label">
                {!o.change && 
                  <span class="label-text" onClick={this.toggleChangeLabel.bind(this, o.id, true)}>{o.label}</span>
                }
                {o.change && 
                  <GetInput class="label-input" id={o.id} onKeyUp={this.changeLabel.bind(this, o.id)} defaultValue={o.label} />
                }
                {!o.change && 
                  <span class="material-icons md-16" onClick={this.removeLabel.bind(this, o.id)}>highlight_off</span>
                }
                {o.change &&
                  <span class="material-icons md-16" onClick={this.toggleChangeLabel.bind(this, o.id, false)}>check_circle_outline</span>
                }
              </GetButton>
            ))}
          </>
        }
        {!this.props.isShowDynamically &&
          <>
            {this.state.labels && this.state.labels.map(o => (
              <GetButton class={`label ${o.active ? 'label-active' : ''}`} onClick={this.toggleLabelActive.bind(this, o.id)}>
                <span class="label-text">{o.label}</span>
              </GetButton>
            ))}
          </>
        }
      </div>
    )
  }
}
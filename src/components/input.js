import React from "react";

export default class GetInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  focusInput() {
    const topicInput = this.inputRef.current;

    topicInput.setSelectionRange(0, 0);
    topicInput.focus();
  }

  render() {
    return (
      <input 
        ref={this.inputRef}
        type="text"
        id={this.props.id}
        className={this.props.class}
        onChange={this.props.onChange}
        onKeyUp={this.props.onKeyUp}
        value={this.props.value}
        defaultValue={this.props.defaultValue}
      />
    )
  }
}

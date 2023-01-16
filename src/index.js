import React from "react";
import ReactDOM from "react-dom/client";
import Concept from "./concept";
import NewConcept from "./newConcept";
import GetButton from "./components/button";
import GetInput from "./components/input";
import GetDialog from "./components/dialog";
import Top from "./top";
import Title from "./title";
import storage from "./storage";
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTopic: false,
      isAddConcept: false,
      isRemoveTopics: false,
      isChangeTopics: false,
      isShowDialog: false,
      isOpenConcepts: false,
      removeTopicId: 0,
      removeConceptId: 0,
      currentTitle: 'Topic Meister',
      currentTopicId: 0,
      newTopicName: '',
      isFilterDesc: true,
      topics: [],
      dropdownItems: [
        { name: 'Add topic', tmp: 'Cancel add', type: 'add' },
        { name: 'Change topic', tmp: 'Cancel change', type: 'change' },
        { name: 'Remove topic', tmp: 'Cancel remove', type: 'remove' }
      ],
      topicsChanged: []
    }
    this.storageKey = 'topic_meister_topics';
    this.handleApplyTopicClick = this.handleApplyTopicClick.bind(this);
    this.handleAddTopicInputChange = this.handleAddTopicInputChange.bind(this);
    this.handleTopicInputChange = this.handleTopicInputChange.bind(this);
    this.handleTopicIconClick = this.handleTopicIconClick.bind(this);
    this.handleDialogClick = this.handleDialogClick.bind(this);
    this.handleClickConceptPlay = this.handleClickConceptPlay.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      const target = e.target;

      if (e.key === 'Enter') {
        if (this.state.newTopicName)
          this.handleApplyTopicClick();
        else if (target.classList.contains('topic-input'))
          this.handleTopicIconClick('change', +target.parentNode.id);
      }
    });

    storage.get(this.storageKey).then(result => {
      if (!result[this.storageKey])
        return;
      this.setState({
        topics: result[this.storageKey]
      });
    });
    // this.toggleOpenConcepts('React', 1);
  }

  getTopicById(topics, id) {
    return topics.find(o => o.id === id);
  }

  updateIndexes(arrayObjects) {
    arrayObjects.forEach((o, i) => o.id = i + 1);
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

    if (this.state.isOpenConcepts)
      return;

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
          <GetButton key={o.id} class="topic" id={o.id} data={type} text={o.change ? '' : o.name}
            onClick={() => type === 'open' && this.handleTopicIconClick(type, o.id)}
          >
            {o.change &&
              <GetInput class="topic-input" defaultValue={o.name} onChange={e => this.handleTopicInputChange(e, o.id)} />
            }
            <span className={`material-icons ${o.remove ? ' md-22' : ''}`} onClick={() => this.handleTopicIconClick(type, o.id)}>{iconType}</span>
          </GetButton>
        )
      })
    );
  }

  renderAddTopic() {
    if (this.state.isAddTopic && !this.state.isOpenConcepts) {
      return (
        <GetButton class="topic">
          <GetInput class="topic-input" value={this.state.newTopicName} onChange={this.handleAddTopicInputChange} />
          <span className="material-icons material-icons-outlined" onClick={this.handleApplyTopicClick}>add_box</span>
        </GetButton>
      );
    }
  }

  renderAddConcept() {
    if (this.state.isAddConcept && this.state.isOpenConcepts) {
      return (
        <NewConcept onAddConceptApply={this.handleAddConceptApply.bind(this)}/>
      );
    }
  }

  renderConcepts() {
    if (!this.state.isOpenConcepts)
      return;

    const currentTopic = this.getTopicById(this.state.topics, this.state.currentTopicId);
    return currentTopic.concepts.map(concept => {
      return <Concept 
              key={concept.id}
              id={concept.id}
              concept={concept} 
              onChangeConceptApply={data => this.changeConcept(data)}
              onClickConceptPlay={this.handleClickConceptPlay}
              onRemoveConcept={() => this.setState({removeConceptId: concept.id, isShowDialog: !this.state.isShowDialog})} />
    });
  }

  renderDialog() {
    if (!this.state.isShowDialog)
      return;

    if (!this.state.isOpenConcepts) {
      return (
        <GetDialog 
          title="Remove topic" 
          content="You really want to delete the topic?" 
          onClick={this.handleDialogClick} />
      );
    } else {
      return (
        <GetDialog 
          title="Remove concept" 
          content="You really want to delete the concept?" 
          onClick={this.handleDialogClick} />
      );
    }
  }

  handleClickConceptPlay(id) {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const currentConcept = currentTopic.concepts.find(o => o.id === id);
    currentConcept.play = !currentConcept.play;

    this.setState({
      topics
    });
    storage.set(this.storageKey, topics);

    /* eslint-disable */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      const currentTabId = tabs[0].id;

      chrome.tabs.sendMessage(
        currentTabId,
        {
          id: currentConcept.id,
          play: currentConcept.play
        },
        () => {
          currentConcept.views += 1;
          currentConcept.playing = true;
          this.setState({
            topics
          });
        }
      );
    });
    /* eslint-enable */
  }

  handleAddTopicInputChange(e) {
    this.setState({
      newTopicName: e.target.value
    });
  }

  handleTopicInputChange(e, id) {
    const topics = structuredClone(this.state.topics);
    this.getTopicById(topics, id).name = e.target.value.trim()

    this.setState({
      topicsChanged: structuredClone(topics)
    });
  }

  focusInput(selector) {
    const topicInput = document.querySelector(selector);

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

  addTopic() {
    const dropdownItemsAdd = this.reverseNameDropdown(0);

    this.setState({
      isAddTopic: !this.state.isAddTopic,
      newTopicName: '',
      dropdownItems: dropdownItemsAdd
    }, () => {
      if (this.state.isAddTopic)
        this.focusInput('.topic-input');
    });
  }

  addConcept() {
    this.setState({
      isAddConcept: !this.state.isAddConcept
    }, () => {
      if (this.state.isAddConcept)
        this.focusInput('.new-concept-input');
    });
  }

  filterConcepts() {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    currentTopic.concepts.reverse();
    
    this.setState({
      topics,
      isFilterDesc: !this.state.isFilterDesc
    });
  }

  handleAddConceptApply(data) {
    const currentTopic = this.getTopicById(this.state.topics, this.state.currentTopicId);
    const clonedTopic = structuredClone(currentTopic);
    const currentConcepts = clonedTopic.concepts;
    const maxConceptId = currentConcepts.length && Math.max.apply(this, currentConcepts.map(o => o.id));

    if (clonedTopic.concepts.some(o => o.title === data.title || o.content === data.content))
      return;

    clonedTopic.concepts.unshift({
      id: !maxConceptId ? 1 : maxConceptId + 1,
      title: data.title,
      content: data.content,
      play: false,
      playing: false,
      views: 0
    });
    const topics = structuredClone(this.state.topics);
    this.getTopicById(topics, this.state.currentTopicId).concepts = currentConcepts;

    this.setState({
      topics
    });
    storage.set(this.storageKey, topics);
  }

  changeTopics() {
    const topics = structuredClone(this.state.topics);
    const dropdownItemsChange = this.reverseNameDropdown(1);
    topics.forEach(o => o.change = !this.state.isChangeTopics);

    this.setState({
      isChangeTopics: !this.state.isChangeTopics,
      dropdownItems: dropdownItemsChange,
      topics,
    }, () => {
      this.focusInput('.topic-input');
    });
  }

  removeTopics() {
    const topics = structuredClone(this.state.topics);
    const dropdownItemsRemove = this.reverseNameDropdown(2);
    topics.forEach(o => o.remove = !this.state.isRemoveTopics);

    this.setState({
      isRemoveTopics: !this.state.isRemoveTopics,
      dropdownItems: dropdownItemsRemove,
      topics,
    });
  }

  removeTopic() {
    const topics = structuredClone(this.state.topics);
    const index = topics.findIndex(o => o.id === this.state.removeTopicId);
    topics.splice(index, 1);
    this.updateIndexes(topics);

    let dropdownItems = this.state.dropdownItems;
    let isRemoveTopics = this.state.isRemoveTopics;
    if (topics.every(o => !o.remove)) {
      dropdownItems = this.reverseNameDropdown(2);
      isRemoveTopics = false;
    }

    this.setState({
      isShowDialog: false,
      removeTopicId: 0,
      dropdownItems,
      isRemoveTopics,
      topics
    });
    storage.set(this.storageKey, topics);
  }

  changeConcept(changedConcept) {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const index = currentTopic.concepts.findIndex(o => o.id === changedConcept.id);
    currentTopic.concepts[index] = changedConcept;

    this.setState({
      topics
    });
    storage.set(this.storageKey, topics);
  }
  
  removeConcept() {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const index = currentTopic.concepts.findIndex(o => o.id === this.state.removeConceptId);
    currentTopic.concepts.splice(index, 1);

    if (this.state.isFilterDesc)
      currentTopic.concepts.reverse();
    this.updateIndexes(currentTopic.concepts);
    if (this.state.isFilterDesc)
      currentTopic.concepts.reverse();

    this.setState({
      isShowDialog: false,
      removeConceptId: 0,
      topics
    });
    storage.set(this.storageKey, topics);
  }

  handleTopicIconClick(type, id) {
    switch (type) {
      case 'change':
        let topicsChanged = structuredClone(this.state[!this.state.topicsChanged.length ? 'topics' : 'topicsChanged']);
        const topicChanged = this.getTopicById(topicsChanged, id);
        const topics = structuredClone(this.state.topics);
        const topic = this.getTopicById(topics, id);

        topic.name = topicChanged.name;
        topic.change = false;

        let dropdownItems = this.state.dropdownItems;
        let isChangeTopics = this.state.isChangeTopics;
        if (topics.every(o => !o.change)) {
          dropdownItems = this.reverseNameDropdown(1);
          topicsChanged = [];
          isChangeTopics = false;
        }

        this.setState({ topics, topicsChanged, dropdownItems, isChangeTopics });
        storage.set(this.storageKey, topics);
        break;
      case 'remove':
        this.setState({
          isShowDialog: !this.state.isShowDialog,
          removeTopicId: id
        });
        break;
      case 'open':
        this.toggleOpenConcepts(this.getTopicById(this.state.topics, id).name, id);
        break;
      default:
    }
  }

  toggleOpenConcepts(currentTitle, currentTopicId) {
    const currentTopic = this.getTopicById(this.state.topics, currentTopicId);
    currentTopic.concepts.reverse();
    this.setState({
      isOpenConcepts: !this.state.isOpenConcepts,
      currentTitle,
      currentTopicId
    });
  }

  handleDialogClick(type) {
    switch (type) {
      case 'decline':
        this.setState({ isShowDialog: false })
        break;
      case 'accept':
        if (this.state.removeTopicId > 0)
          this.removeTopic();
        if (this.state.removeConceptId > 0)
          this.removeConcept();
        break;
      default:
    }
  }

  handleApplyTopicClick() {
    const newTopicName = this.state.newTopicName;
    let topics = structuredClone(this.state.topics);

    if (!newTopicName || topics.some(v => v.name === newTopicName)) {
      return;
    }

    topics.unshift({ id: 1, name: newTopicName.trim(), change: false, remove: false, concepts: [] });
    this.updateIndexes(topics);

    this.setState({
      topics,
      newTopicName: ''
    });
    storage.set(this.storageKey, topics);
  }

  render() {
    return (
      <div className="topic-meister">
        <div className="top">
          <Title 
            isOpenConcepts={this.state.isOpenConcepts} 
            currentTitle={this.state.currentTitle}
            toggleOpenConcepts={this.toggleOpenConcepts.bind(this, 'Topic Meister', this.state.currentTopicId)}/>
          <Top
            isOpenConcepts={this.state.isOpenConcepts}
            isFilterDesc={this.state.isFilterDesc}
            items={this.state.dropdownItems} 
            onAddTopic={this.addTopic.bind(this)}
            onChangeTopics={this.changeTopics.bind(this)}
            onRemoveTopics={this.removeTopics.bind(this)}
            onAddConcept={this.addConcept.bind(this)}
            onFilterConcepts={this.filterConcepts.bind(this)}/>
        </div>
        {this.renderAddTopic()}
        {this.renderTopics()}
        {this.renderAddConcept()}
        {this.renderConcepts()}
        {this.renderDialog()}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
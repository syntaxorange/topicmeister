import React from "react";
import ReactDOM from "react-dom/client";
import Concept from "./concept";
import Topic from "./topic";
import NewTopic from "./newTopic";
import NewConcept from "./newConcept";
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
      isPlayAllConcepts: false,
      removeTopicId: 0,
      removeConceptId: 0,
      currentTitle: 'Topic Meister',
      currentTopicId: 0,
      isFilterDesc: true,
      topics: [],
      conceptsTmp: [],
      dropdownItems: [
        { name: 'Add topic', tmp: 'Cancel add', type: 'add' },
        { name: 'Change topic', tmp: 'Cancel change', type: 'change' },
        { name: 'Remove topic', tmp: 'Cancel remove', type: 'remove' }
      ]
    }
    this.storageKey = 'topic_meister_topics';
    this.newTopicRef = React.createRef();
    this.dropdownRef = React.createRef();
    this.newConceptRef = React.createRef();
    this.topicsRef = new WeakMap;
    this.conceptsRef = new WeakMap;
  }

  componentDidMount() {
    storage.get(this.storageKey).then(result => {
      if (!result[this.storageKey])
        return;
      const topics = result[this.storageKey];

      if (topics.some(o => o.remove)) {
        topics.forEach(o => o.remove = false);
      }
      
      if (topics.some(o => o.change)) {
        topics.forEach(o => o.change = false);
      }

      this.setState({ topics });
    });
  }

  getTopicById(topics, id) {
    return topics.find(o => o.id === id);
  }

  getConceptById(topic, id) {
    return topic.concepts.find(o => o.id == id);
  }

  setTopicRef = o => ref => {
    this.topicsRef.set(o, ref);
  }

  setConceptRef = o => ref => {
    this.conceptsRef.set(o, ref);
  }

  setRemoveTopicId(id) {
    this.setState({
      isShowDialog: !this.state.isShowDialog,
      removeTopicId: id
    });
  }

  updateIndexes(arrayObjects, updateTopicId = true) {
    arrayObjects.forEach((o, i) => {
      o.id = i + 1;

      if (updateTopicId)
        o.concepts.forEach(o1 => o1.topicId = o.id);
    });
  }

  renderAddTopic() {
    if (this.state.isAddTopic && !this.state.isOpenConcepts) {
      return (
        <NewTopic ref={this.newTopicRef} onApplyAddTopicClick={this.addNewTopic.bind(this)}/>
      );
    }
  }

  renderAddConcept() {
    if (this.state.isAddConcept && this.state.isOpenConcepts) {
      return (
        <NewConcept ref={this.newConceptRef} onAddConceptApply={this.addNewConcept.bind(this)}/>
      );
    }
  }

  renderTopics() {
    if (this.state.isOpenConcepts)
      return;

    return (
      this.state.topics.map(topic => {
        return (
          <Topic
            ref={this.setTopicRef(topic)}
            topic={topic} 
            isRemoveTopics={this.state.isRemoveTopics} 
            isChangeTopics={this.state.isChangeTopics} 
            onOpenTopicClick={this.openTopicClick.bind(this)}
            onRemoveTopicClick={this.setRemoveTopicId.bind(this)}
            onChangeTopicClick={this.changeTopicName.bind(this)}
          />
        )
      })
    );
  }

  renderConcepts() {
    if (!this.state.isOpenConcepts)
      return;

    const currentTopic = this.getTopicById(this.state.topics, this.state.currentTopicId);
    return currentTopic.concepts.map(concept => {
      return <Concept 
              ref={this.setConceptRef(concept)}
              key={concept.id}
              id={concept.id}
              concept={concept} 
              onToggleLabelActive={data => this.changeConceptData(data, false, true)}
              onChangeConceptApply={data => this.changeConceptData(data)}
              onClickConceptPlay={this.playConcept.bind(this)}
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
          onClick={this.handleDialogClick.bind(this)} />
      );
    } else {
      return (
        <GetDialog 
          title="Remove concept" 
          content="You really want to delete the concept?" 
          onClick={this.handleDialogClick.bind(this)} />
      );
    }
  }

  sendChromeMessage({ id, play, topicId, currentConcept, topics, change, remove }) {
    /* eslint-disable */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      const currentTabId = tabs[0].id;

      chrome.tabs.sendMessage(
        currentTabId,
        { id, play, topicId, topics, change, remove },
        data => {
          if (!data)
            return
          const { playing, someId, someTopicId, startTime, someStartTime } = data;
          if (playing === undefined || remove)
            return;
          if (playing)
            currentConcept.views += 1;
          currentConcept.playing = playing;
          currentConcept.startTime = startTime;
          if (someId) {
            const currentTopic = this.getTopicById(topics, someTopicId);
            const someConceptPlay = this.getConceptById(currentTopic, someId);
            someConceptPlay.playing = true;
            someConceptPlay.startTime = someStartTime;
          }
          this.setState({ topics });
        }
      );
    });
    /* eslint-enable */
  }

  playConcept(id) {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const currentConcept = currentTopic.concepts.find(o => o.id === id);
    currentConcept.play = !currentConcept.play;

    this.setState({
      topics,
      isPlayAllConcepts: currentTopic.concepts.every(o => o.play)
    });

    const { play, topicId } = currentConcept;

    this.sendChromeMessage({ id, play, topicId, currentConcept, topics });
  }

  playConcepts() {
    const topics = this.state.topics;
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const currentConcepts = currentTopic.concepts;

    if (!currentConcepts.length)
      return;
      
    currentConcepts.forEach(o => {
      o.play = !this.state.isPlayAllConcepts
    });

    this.setState({
      isPlayAllConcepts: !this.state.isPlayAllConcepts,
      topics
    });
    
    const playingConcept = currentConcepts.find(o => o.playing);
    const currentConcept = playingConcept ? playingConcept : currentConcepts[0];
    const { id, play, topicId } = currentConcept;

    this.sendChromeMessage({ id, play, topicId, currentConcept, topics });
  }

  changeTopicName(id, name) {
    const topics = structuredClone(this.state.topics);
    const topic = this.getTopicById(topics, id);

    topic.name = name || topic.name;
    topic.change = false;

    let dropdownItems = this.state.dropdownItems;
    let isChangeTopics = this.state.isChangeTopics;
    if (topics.every(o => !o.change)) {
      dropdownItems = this.dropdownRef.current.reverseNameDropdown(1);
      isChangeTopics = false;
    }

    this.setState({ topics, dropdownItems, isChangeTopics });
    storage.set(this.storageKey, topics);
  }

  changeConceptData(changedConcept, play = true, filterByLabels) {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const index = currentTopic.concepts.findIndex(o => o.id === changedConcept.id);
    currentTopic.concepts[index] = changedConcept;

    this.setState({
      topics
    }, () => {
      if (filterByLabels)
        this.filterConceptsByLabels();
    });

    if (!play)
      return;

    const { id, topicId } = changedConcept;
    this.sendChromeMessage({ id, topicId, topics, change: true });
  }

  openTopicClick(id) {
    this.toggleOpenTopic(this.getTopicById(this.state.topics, id).name, id);
  }

  toggleAddTopicInput() {
    const dropdownItemsAdd = this.dropdownRef.current.reverseNameDropdown(0);

    this.setState({
      isAddTopic: !this.state.isAddTopic,
      dropdownItems: dropdownItemsAdd
    }, () => {
      if (this.state.isAddTopic)
        this.newTopicRef.current.focusInput();
    });
  }

  toggleAddConceptField() {
    this.setState({
      isAddConcept: !this.state.isAddConcept
    }, () => {
      if (this.state.isAddConcept)
        this.newConceptRef.current.focusInput();
    });
  }

  toggleChangeTopicsInput() {
    const topics = structuredClone(this.state.topics);
    const dropdownItemsChange = this.dropdownRef.current.reverseNameDropdown(1);
    topics.forEach(o => o.change = !this.state.isChangeTopics);

    this.setState({
      isChangeTopics: !this.state.isChangeTopics,
      dropdownItems: dropdownItemsChange,
      topics,
    }, () => {
      storage.set(this.storageKey, topics);
      this.topicsRef.get(topics[0])?.focusInput();
    });
  }

  toggleRemoveTopicsIcon() {
    const topics = structuredClone(this.state.topics);
    const dropdownItemsRemove = this.dropdownRef.current.reverseNameDropdown(2);
    topics.forEach(o => o.remove = !this.state.isRemoveTopics);

    this.setState({
      isRemoveTopics: !this.state.isRemoveTopics,
      dropdownItems: dropdownItemsRemove,
      topics,
    });
  }

  toggleOpenTopic(currentTitle, currentTopicId) {
    this.setState({
      isOpenConcepts: !this.state.isOpenConcepts,
      currentTitle,
      currentTopicId
    }, () => {
      storage.get(this.storageKey).then(result => {
        const currentTopic = this.getTopicById(result[this.storageKey], this.state.currentTopicId);
        const currentConcepts = currentTopic.concepts;
        this.setState({
          isPlayAllConcepts: currentConcepts.length ? currentConcepts.every(o => o.play) : this.state.isPlayAllConcepts
        });
      });
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

  filterConceptsByLabels() {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    let concepts = null;

    if (this.state.conceptsTmp.length) {
      const conceptsTmp = structuredClone(this.state.conceptsTmp);

      conceptsTmp.forEach(o => {
        const foundConcept = currentTopic.concepts.find(o1 => o1.id === o.id);
        if (!foundConcept)
          return;
        o.labels.forEach(o1 => {
          const foundLabel = foundConcept.labels.find(o2 => o2.id === o1.id);
          o1.active = foundLabel.active;
        })
      });

      concepts = conceptsTmp;
    } else {
      concepts = currentTopic.concepts;
    }

    const activeLabels = concepts
      .map(o => o.labels.map(o1 => o1.active && o1.label))
      .flat().filter(v => typeof v === 'string')
      .filter((v, i, a) => a.indexOf(v) === i);

    if (activeLabels.length === 1) {
      this.setState({ conceptsTmp: structuredClone(concepts) });
    }

    if (activeLabels.length) {
      const filteredConcepts = concepts.filter(o => o.labels.some(o1 => activeLabels.indexOf(o1.label) >= 0));
      currentTopic.concepts = filteredConcepts;

      this.setState({ topics });
    } else {
      const concepts = structuredClone(this.state.conceptsTmp);
      
      concepts.forEach(o => o.labels.forEach(o1 => o1.active = false));
      currentTopic.concepts = concepts;
        
      this.setState({
        topics,
        conceptsTmp: []
      });
    }
  }

  addNewTopic(name) {
    let topics = structuredClone(this.state.topics);

    if (topics.some(v => v.name === name))
      return;

    topics.unshift({ id: 1, name: name.trim(), change: false, remove: false, concepts: [] });
    this.updateIndexes(topics);
    this.setState({ topics });
    this.newTopicRef.current.resetName();
    storage.set(this.storageKey, topics);
  }

  addNewConcept(data) {
    const currentTopic = this.getTopicById(this.state.topics, this.state.currentTopicId);
    const clonedTopic = structuredClone(currentTopic);
    const currentConcepts = clonedTopic.concepts;
    const maxConceptId = currentConcepts.length && Math.max.apply(this, currentConcepts.map(o => o.id));

    if (clonedTopic.concepts.some(o => o.title === data.title || o.content === data.content))
      return;

    clonedTopic.concepts.unshift({
      id: !maxConceptId ? 1 : maxConceptId + 1,
      title: data.title.trim(),
      content: data.content.trim(),
      labels: data.labels,
      topicId: this.state.currentTopicId,
      play: false,
      playing: false,
      startTime: null,
      views: 0
    });
    const topics = structuredClone(this.state.topics);
    this.getTopicById(topics, this.state.currentTopicId).concepts = currentConcepts;

    this.setState({ topics });
    storage.set(this.storageKey, topics);
  }

  removeTopic() {
    const topics = structuredClone(this.state.topics);
    const index = topics.findIndex(o => o.id === this.state.removeTopicId);
    const playing = topics[index].concepts.find(o => o.playing);

    topics.splice(index, 1);
    this.updateIndexes(topics);

    let dropdownItems = this.state.dropdownItems;
    let isRemoveTopics = this.state.isRemoveTopics;
    if (topics.every(o => !o.remove)) {
      dropdownItems = this.dropdownRef.current.reverseNameDropdown(2);
      isRemoveTopics = false;
    }

    this.setState({
      isShowDialog: false,
      removeTopicId: 0,
      dropdownItems,
      isRemoveTopics,
      topics
    });

    if (playing) {
      const { id, topicId } = playing;
      
      this.sendChromeMessage({ id, topicId, topics, remove: true });
    } else {
      storage.set(this.storageKey, topics);
    }
  }

  removeConcept() {
    const topics = structuredClone(this.state.topics);
    const currentTopic = this.getTopicById(topics, this.state.currentTopicId);
    const index = currentTopic.concepts.findIndex(o => o.id === this.state.removeConceptId);
    currentTopic.concepts.splice(index, 1);

    if (this.state.isFilterDesc)
      currentTopic.concepts.reverse();
    this.updateIndexes(currentTopic.concepts, false);
    if (this.state.isFilterDesc)
      currentTopic.concepts.reverse();

    this.setState({
      isShowDialog: false,
      removeConceptId: 0,
      topics
    });

    this.sendChromeMessage({ id: this.state.removeConceptId, topics, remove: true });
  }
  
  handleDialogClick(type) {
    switch (type) {
      case 'decline':
        this.setState({ isShowDialog: false }, () => {
          if (this.state.removeConceptId > 0) {
            const currentTopic = this.getTopicById(this.state.topics, this.state.currentTopicId);
            const currentConcept = this.getConceptById(currentTopic, this.state.removeConceptId);
            this.conceptsRef.get(currentConcept)?.reverseNameDropdown(1);
          }
        });
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

  render() {
    return (
      <div className="topic-meister">
        <div className="top">
          <Title 
            isOpenConcepts={this.state.isOpenConcepts} 
            currentTitle={this.state.currentTitle}
            toggleOpenTopic={this.toggleOpenTopic.bind(this, 'Topic Meister', this.state.currentTopicId)}/>
          <Top
            ref={this.dropdownRef}
            isOpenConcepts={this.state.isOpenConcepts}
            isFilterDesc={this.state.isFilterDesc}
            isPlayAllConcepts={this.state.isPlayAllConcepts}
            dropdownItems={this.state.dropdownItems} 
            onAddTopic={this.toggleAddTopicInput.bind(this)}
            onChangeTopics={this.toggleChangeTopicsInput.bind(this)}
            onRemoveTopics={this.toggleRemoveTopicsIcon.bind(this)}
            onAddConcept={this.toggleAddConceptField.bind(this)}
            onFilterConcepts={this.filterConcepts.bind(this)}
            onClickConceptsPlay={this.playConcepts.bind(this)}/>
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
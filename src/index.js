import React from "react";
import ReactDOM from "react-dom/client";
import Concept from "./concept";
import NewConcept from "./newConcept";
import GetButton from "./components/button";
import GetInput from "./components/input";
import GetDialog from "./components/dialog";
import Top from "./top";
import Title from "./title";
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
      currentTitle: 'Topic Meister',
      currentTopicId: 0,
      newTopicName: '',
      topics: [
        {
          id: 1, name: 'React', change: false, remove: false,
          concepts: [
            { id: 1, title: 'Что такое React', content: 'React — JavaScript-библиотека с открытым исходным кодом для разработки пользовательских интерфейсов. Его цель — предоставить высокую скорость разработки. React — JavaScript-библиотека с открытым исходным кодом для разработки пользовательских интерфейсов. Его цель — предоставить высокую скорость разработки', views: 10 },
            { id: 2, title: 'Компоненты', content: 'React — JavaScript-библиотека с открытым исходным кодом для разработки пользовательских интерфейсов. Его цель — предоставить высокую скорость разработки. React — JavaScript-библиотека с открытым исходным кодом для разработки пользовательских интерфейсов. Его цель — предоставить высокую скорость разработки', views: 15 }
          ]
        },
        { id: 2, name: 'Angular', change: false, remove: false, concepts: [] },
        { id: 3, name: 'Vue', change: false, remove: false, concepts: [] },
        { id: 4, name: 'JavaScript', change: false, remove: false, concepts: [] },
        { id: 5, name: 'Css', change: false, remove: false, concepts: [] },
        { id: 6, name: 'Html', change: false, remove: false, concepts: [] }
      ],
      dropdownItems: [
        { name: 'Add topic', tmp: 'Cancel add', type: 'add' },
        { name: 'Change topic', tmp: 'Cancel change', type: 'change' },
        { name: 'Remove topic', tmp: 'Cancel remove', type: 'remove' }
      ],
      topicsChanged: []
    }
    this.handleApplyTopicClick = this.handleApplyTopicClick.bind(this);
    this.handleAddTopicInputChange = this.handleAddTopicInputChange.bind(this);
    this.handleTopicInputChange = this.handleTopicInputChange.bind(this);
    this.handleTopicIconClick = this.handleTopicIconClick.bind(this);
    this.handleDialogClick = this.handleDialogClick.bind(this);
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

    // this.toggleOpenConcepts('React', 1);
  }

  getTopicById(topics, id) {
    return topics.find(o => o.id === id);
  }

  updateIndexes(topics) {
    topics.forEach((o, i) => o.id = i + 1);
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
    const currentConcepts = structuredClone(currentTopic.concepts);
    return currentConcepts.reverse().map(concept => {
      return <Concept key={concept.id} concept={concept} />
    });
  }

  handleAddTopicInputChange(e) {
    this.setState({
      newTopicName: e.target.value
    });
  }

  handleTopicInputChange(e, id) {
    const topics = structuredClone(this.state.topics);
    this.getTopicById(topics, id).name = e.target.value

    this.setState({
      topicsChanged: structuredClone(topics)
    });
  }

  focusInput() {
    const topicInput = document.querySelector('.topic-input');

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
        this.focusInput();
    });
  }

  addConcept() {
    this.setState({
      isAddConcept: !this.state.isAddConcept
    });
  }

  handleAddConceptApply(data) {
    const currentTopic = this.getTopicById(this.state.topics, this.state.currentTopicId);
    const clonedTopic = structuredClone(currentTopic);
    const currentConcepts = clonedTopic.concepts;
    const lastConceptId = currentConcepts[currentConcepts.length - 1]?.id;

    if (clonedTopic.concepts.some(o => o.title === data.title || o.content === data.content))
      return;

    clonedTopic.concepts.push({
      id: !lastConceptId ? 1 : lastConceptId + 1,
      title: data.title,
      content: data.content,
      views: 0
    });
    const topics = structuredClone(this.state.topics);
    this.getTopicById(topics, this.state.currentTopicId).concepts = currentConcepts;

    this.setState({
      topics
    });
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
      this.focusInput();
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

    topics.unshift({ id: 1, name: newTopicName, change: false });
    this.updateIndexes(topics);

    this.setState({
      topics,
      newTopicName: ''
    });
  }

  render() {
    return (
      <div className="topic-meister">
        <div className="top">
          <Title 
            isOpenConcepts={this.state.isOpenConcepts} 
            currentTitle={this.state.currentTitle}
            toggleOpenConcepts={this.toggleOpenConcepts.bind(this, 'Topic Meister', 0)}/>
          <Top
            isOpenConcepts={this.state.isOpenConcepts}
            items={this.state.dropdownItems} 
            onAddTopic={this.addTopic.bind(this)}
            onChangeTopics={this.changeTopics.bind(this)}
            onRemoveTopics={this.removeTopics.bind(this)}
            onAddConcept={this.addConcept.bind(this)}/>
        </div>
        {this.renderAddTopic()}
        {this.renderTopics()}
        {this.renderAddConcept()}
        {this.renderConcepts()}
        {this.state.isShowDialog &&
          <GetDialog title="Remove" content="You really want to delete the topic?" onClick={this.handleDialogClick} />
        }
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
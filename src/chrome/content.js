import storage from "../storage";

/* eslint-disable */
const storageKey = 'topic_meister_topics';
const storageKeyCoor = 'topic_meister_topic_coor';
const storageKeyToogle = 'topic_meister_topic_toggle';
const playTime = 10 * 60 * 1000;
let playTimeout = playTime;
let toggle = false;
let timerId = 0;
let index = 0;

const moveState = {
  bound: null,
  x: 0,
  y: 0,
  move: false
}

const removeTopic = () => {
  const existingTopic = document.getElementById('topic_meister_topic');
  if (existingTopic)
    existingTopic.remove();
}

const switchConcept = (topics, isUpdateCounter = true) => {
  if (!Object.keys(topics).length) {
    clearTimeout(timerId);
    return;
  }
  const concepts = getConcepts(topics);
  
  if (!concepts.length) {
    clearTimeout(timerId);
    return;
  }
  index = getPlayingConceptIndex(concepts);
  if (index === concepts.length - 1) {
    index = 0;
    const concept = concepts[concepts.length - 1];
    concept.playing = false;
    concept.startTime = null;
  } else {
    index += 1;
    const concept = concepts[index - 1];
    concept.playing = false;
    concept.startTime = null;
  }
  
  const concept = concepts[index];
  playTimeout = playTime;
  addTopic({title: concept.title, content: concept.content});
  playConcept(topics, concept, { isUpdateCounter, isStorage: true });
}

const runTimer = () => {
  timerId = setTimeout(function tick() {
    storage.get(storageKey).then(topics => {
      switchConcept(topics);
      timerId = setTimeout(tick, playTimeout); 
    });
  }, playTimeout);
}

const getTopicPosition = (topicOffset, e) => {
  const { clientX: x, clientY: y } = e;
  const { x: topicOffsetX, y: topicOffsetY } = topicOffset;

  return {
    'x': x - topicOffsetX + 'px',
    'y': y - topicOffsetY + 'px'
  }
}

const getTopicOffset = e => {
  const y = e.clientY - e.currentTarget.offsetTop;
  const x = e.clientX - e.currentTarget.offsetLeft;

  return { x, y };
}

const moveTopic = e => {
  if (!chrome.runtime?.id)
    alert('Extension context invalidated. Please reload page.');
  const topicOffset = getTopicOffset(e);

  moveState.bound = (e) => {
    const { x, y } = getTopicPosition.call(e.currentTarget, topicOffset, e);

    e.currentTarget.style.right = '';
    e.currentTarget.style.left = x;
    e.currentTarget.style.top = y;
    moveState.x = x;
    moveState.y = y;
  }
  moveState.move = true;
}

const stopTopic = topic => {
  if (moveState.move) {
    if (chrome.runtime?.id)
      storage.set(storageKeyCoor, { x: moveState.x, y: moveState.y });
    topic.removeEventListener('mousemove', moveState.bound);
    moveState.move = false;
  }
}

const putDefaultPlace = topic => {
  topic.style.left = '';
  topic.style.right = '10px'
  topic.style.top = '10px'
  storage.remove(storageKeyCoor);
}

const putOnChangedPlace = topic => {
  storage.get(storageKeyCoor).then(result => {
    const coor = result[storageKeyCoor];

    if (coor && coor.x && coor.y) {
      topic.style.left = coor.x;
      topic.style.top = coor.y;
    }
  });
}

const toggleTopic = ({ topic, topicContainer, topicToggle, topicSwitch }) => {
  topicContainer.style.display = toggle ? 'none' : 'flex';
  topicToggle.style.height = toggle ? '100%' : '30px';
  topicToggle.textContent = toggle ? 'TM' : '';
  topicSwitch.style.height = toggle ? '0' : '30px';
  topic.style.top = toggle ? '0' : '10px';
  topic.style.right = toggle ? '-480px' : '10px';
  topic.style.left = '';
  if (toggle) {
    clearTimeout(timerId);
  } else {
    storage.remove(storageKeyToogle);
    putOnChangedPlace(topic);
    runTimer();
  }
}

const bindTopicEvents = ({ topic, topicControls, topicContainer, topicToggle, topicSwitch }) => {
  topic.addEventListener('mouseenter', () => {
    topic.style.opacity = '1';
    if (!toggle) {
      topicControls.style.left = '-20px';
      topicControls.style.bottom = '-20px';
    }
  });
  topic.addEventListener('mouseleave', () => {
    topic.style.opacity = '.7';
    topicControls.style.left = '0';
    topicControls.style.bottom = '0';
  });
  topic.addEventListener('mousedown', (e) => {
    moveTopic(e);
    topic.addEventListener('mousemove', moveState.bound);
  });
  topic.addEventListener('mouseleave', () => {
    stopTopic(topic);
  });
  topic.addEventListener('mouseup', () => {
    stopTopic(topic);
  });
  topic.addEventListener('dblclick', () => {
    putDefaultPlace(topic);
  });
  topicSwitch.addEventListener('click', () => {
    clearTimeout(timerId);
    storage.get(storageKey).then(topics => {
      switchConcept(topics, false);
      runTimer();
    });
  });
  topicToggle.addEventListener('click', () => {
    toggle = !toggle;
    toggleTopic({ topic, topicContainer, topicToggle, topicSwitch });
    storage.set(storageKeyToogle, toggle);
  });
}

const addTopic = ({title, content}) => {
  removeTopic();
  const body = document.querySelector('body');
  const topic = document.createElement('div');
  const topicContainer = document.createElement('div');
  const topicContent = document.createElement('div');
  const topicTitle = document.createElement('div');
  const topicControls = document.createElement('div');
  const topicSwitch = document.createElement('div');
  const topicToggle = document.createElement('div');
  topic.id = 'topic_meister_topic';
  topic.style.fontFamily = "'Roboto', sans-serif";
  topic.style.position = 'fixed';
  topic.style.top = '10px';
  topic.style.right = '10px';
  topic.style.zIndex = '99999';
  topic.style.width = '550px';
  topic.style.minHeight = '114px';
  topic.style.opacity = '.7';
  topicContainer.style.position = 'relative';
  topicContainer.style.zIndex = '1';
  topicContainer.style.display = 'flex';
  topicContainer.style.alignContent = 'space-between';
  topicContainer.style.flexWrap = 'wrap';
  topicContainer.style.boxSizing = 'border-box';
  topicContainer.style.width = '100%';
  topicContainer.style.minHeight = '114px';
  topicContainer.style.padding = '15px';
  topicContainer.style.borderRadius = '5px';
  topicContainer.style.backgroundColor = '#ffffff';
  topicContainer.style.boxShadow = '0 3px 4px rgba(0, 0, 0, 0.25)';
  topicContent.style.fontSize = '14px';
  topicContent.style.lineHeight = '130%';
  topicContent.style.width = '100%';
  topicContent.style.marginBottom = '8px';
  topicContent.style.color = '#1c1c1c';
  topicTitle.style.fontSize = '12px';
  topicTitle.style.width = '100%';
  topicTitle.style.color = '#464646';
  topicControls.style.position = 'absolute';
  topicControls.style.lineHeight = '60px';
  topicControls.style.left = '0';
  topicControls.style.bottom = '0';
  topicControls.style.width = '60px';
  topicControls.style.height = '60px';
  topicControls.style.textAlign = 'center';
  topicControls.style.color = '#202124';
  topicControls.style.borderRadius = '100%';
  topicControls.style.backgroundColor = '#ffffff';
  topicControls.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.25)';
  topicControls.style.transition = 'all 0.2s linear';
  topicToggle.style.fontSize = '14px';
  topicToggle.style.width = '100%';
  topicToggle.style.height = '30px';
  topicSwitch.style.width = '100%';
  topicSwitch.style.height = '30px';
  topicToggle.type = 'button';
  topicSwitch.type = 'button';

  topicContent.textContent = content;
  topicTitle.textContent = title;
  
  topic.appendChild(topicContainer);
  topicContainer.appendChild(topicContent);
  topicContainer.appendChild(topicTitle);
  topicControls.appendChild(topicToggle);
  topicControls.appendChild(topicSwitch);
  topic.appendChild(topicControls);
  putOnChangedPlace(topic);
  body.appendChild(topic);
  bindTopicEvents({topic, topicControls, topicContainer, topicToggle, topicSwitch});
}

const playConcept = (topics, concept, { isUpdateCounter, isStorage, startTime}) => {
  if (isUpdateCounter) {
    concept.views += 1;
    concept.playing = true;
    concept.startTime = (new Date).getTime();
  }
  if (isStorage)
    storage.set(storageKey, topics[storageKey]);
  addTopic({title: concept.title, content: concept.content});
}

const stopConcept = (topics, concept) => {
  if (concept) {
    concept.playing = false;
    concept.startTime = null;
  }
  storage.set(storageKey, topics[storageKey]);
  document.getElementById('topic_meister_topic').remove();
}

const getConcepts = (topics, all = false) => {
  return topics[storageKey]
          .filter(topic => topic.concepts.length)
          .map(topic => topic.concepts.filter(concept => all ? concept : concept.play)).flat();
}

const getPlayingConceptIndex = concepts => {
  return concepts.findIndex(o => o.playing);
}

const init = () => {
  storage.get(storageKey).then(topics => {
    if (!Object.keys(topics).length)
      return;
    const concepts = getConcepts(topics);
   
    if (!concepts.length)
      return;
    const index = getPlayingConceptIndex(concepts);
    playConcept(topics, concepts[index], { isUpdateCounter: false, isStorage: false });
    const topic = document.getElementById('topic_meister_topic');

    storage.get(storageKeyToogle).then(result => {
      if (result[storageKeyToogle] === undefined)
        return;

      toggle = result[storageKeyToogle];
      toggleTopic({ 
        topic, 
        topicContainer: topic.firstElementChild, 
        topicToggle: topic.lastElementChild.firstElementChild, 
        topicSwitch: topic.lastElementChild.lastElementChild
       });
    });
    
    const timeLeft = (new Date).getTime() - concepts[index].startTime;
    playTimeout = timeLeft > playTime ? 0 : playTime - timeLeft;
    console.log('%c%s', 'color: #1995d7', playTimeout * 0.001 / 60);
    runTimer();
  });
  
  chrome.runtime.onMessage.addListener(({ id, play, topicId, topics, change, remove }, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id)
      return;

    const topicsWithStorageKey = { 'topic_meister_topics' : topics };
    const allConcepts = getConcepts(topicsWithStorageKey, true);
    const currentConcept = allConcepts.find(o => o.topicId === topicId && o.id === id);
    const startTime = (new Date).getTime();
    
    if (change) {
      if (currentConcept.playing) {
        playConcept(topicsWithStorageKey, currentConcept, { isUpdateCounter: false, isStorage: true });
        clearTimeout(timerId);
        runTimer();
      } else {
        storage.set(storageKey, topics);
      }

      return;
    }

    if (play) {
      if (!allConcepts.some(o => o.playing)) {
        playConcept(topicsWithStorageKey, currentConcept, { isUpdateCounter: true, isStorage: true, startTime });
        sendResponse({ playing: true, startTime });
        clearTimeout(timerId);
        runTimer();
      } else {
        storage.set(storageKey, topics);
        sendResponse();
      }
    }

    if (!play && (remove || currentConcept.playing)) {
      stopConcept(topicsWithStorageKey, !remove && currentConcept);
      const isSomeConceptPlay = allConcepts.some(o => o.play);
      
      if (isSomeConceptPlay) {
        const someConceptPlay = allConcepts.find(o => o.play);

        playConcept(topicsWithStorageKey, someConceptPlay, { isUpdateCounter: true, isStorage: true, startTime });
        sendResponse({ playing: false, startTime: null, someId: someConceptPlay.id, someTopicId: someConceptPlay.topicId, someStartTime: startTime });
        clearTimeout(timerId);
        runTimer();
      } else {
        sendResponse({ playing: false, startTime: null });
      }
    }
  });
}

init();
/* eslint-enable */
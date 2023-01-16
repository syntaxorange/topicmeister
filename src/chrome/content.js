import storage from "../storage";
/* eslint-disable */
const storageKey = 'topic_meister_topics';
let timerId = 0;
const removeTopic = () => {
  const existingTopic = document.getElementById('topic_meister_topic');
  if (existingTopic)
    existingTopic.remove();
}

const addTopic = ({title, content}) => {
  removeTopic();
  const body = document.querySelector('body');
  const topic = document.createElement('div');
  const topicContent = document.createElement('div');
  const topicTitle = document.createElement('div');
  topic.id = 'topic_meister_topic';
  topic.style.fontFamily = "'Roboto', sans-serif";
  topic.style.position = 'fixed';
  topic.style.top = '10px';
  topic.style.right = '10px';
  topic.style.zIndex = '99999';
  topic.style.boxSizing = 'border-box';
  topic.style.display = 'flex';
  topic.style.alignContent = 'space-between';
  topic.style.flexWrap = 'wrap';
  topic.style.width = '550px';
  topic.style.minHeight = '114px';
  topic.style.padding = '15px';
  topic.style.borderRadius = '5px';
  topic.style.backgroundColor = '#ffffff';
  topic.style.boxShadow = '0 3px 4px rgba(0, 0, 0, 0.25)';
  topicContent.style.fontSize = '14px';
  topicContent.style.lineHeight = '130%';
  topicContent.style.width = '100%';
  topicContent.style.marginBottom = '8px';
  topicContent.style.color = '#1c1c1c';
  topicTitle.style.fontSize = '12px';
  topicTitle.style.width = '100%';
  topicTitle.style.color = '#464646';
  topicContent.textContent = content;
  topicTitle.textContent = title;
  
  topic.appendChild(topicContent);
  topic.appendChild(topicTitle);
  body.appendChild(topic);
}

const playConcept = (topics, concept) => {
  concept.views += 1;
  concept.playing = true;
  console.table(concept);
  storage.set(storageKey, topics[storageKey]);
  addTopic({title: concept.title, content: concept.content});
}

const stopConcept = (topics, concept) => {
  if (!concept.playing)
    return;
  concept.playing = false;
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

storage.get(storageKey).then(topics => {
  if (!Object.keys(topics).length)
    return;
  const concepts = getConcepts(topics);
  console.log('%c⧭', 'color: #d0bfff', concepts);
 
  if (!concepts.length)
    return;
  const index = getPlayingConceptIndex(concepts);
  playConcept(topics, concepts[index]);
});

const runTimer = () => {
  const playTimeout = 10000;
  let index = 0;
  timerId = setTimeout(function tick() {
    storage.get(storageKey).then(topics => {
      if (!Object.keys(topics).length) {
        clearTimeout(timerId);
        return;
      }
      const concepts = getConcepts(topics);
      index = getPlayingConceptIndex(concepts);
  
      if (!concepts.length) {
        clearTimeout(timerId);
        return;
      }
      if (index === concepts.length - 1) {
        index = 0;
        concepts[concepts.length - 1].playing = false;
      } else {
        index += 1;
        concepts[index - 1].playing = false;
      }
      
      console.log('%c⧭', 'color: #99614d', concepts);
      addTopic({title: concepts[index].title, content: concepts[index].content});
      playConcept(topics, concepts[index]);
      timerId = setTimeout(tick, playTimeout); 
    });
  }, playTimeout);
}
runTimer();
chrome.runtime.onMessage.addListener(({ id, play }, sender, sendResponse) => {
  console.log('%c⧭', 'color: #514080', sendResponse);
  storage.get(storageKey).then(topics => {
    const concepts = getConcepts(topics, true);

    if (play && concepts.length === 1) {
      playConcept(topics, concepts[0]);
      clearTimeout(timerId);
      sendResponse();
      runTimer();
    }
    if (!play)
      stopConcept(topics, concepts.find(o => o.id === id));
  });
});
/* eslint-enable */
import storage from "../storage";
/* eslint-disable */
const storageKey = 'topic_meister_topics';
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
  topicTitle.style.fontSize = '12px';
  topicTitle.style.width = '100%';
  topicTitle.style.color = '#464646';
  topicContent.textContent = content;
  topicTitle.textContent = title;
  
  topic.appendChild(topicContent);
  topic.appendChild(topicTitle);
  body.appendChild(topic);
}

const getConcepts = topics => {
  return topics[storageKey]
          .filter(topic => topic.concepts.length)
          .map(topic => topic.concepts.filter(concept => concept.play)).flat();
}

chrome.storage.local.get([storageKey]).then(topics => {
  const concepts = getConcepts(topics);
 
  if (!concepts.length)
    return;
  concepts[0].views += 1;
  concepts[0].playing = true;
  storage.set(storageKey, topics[storageKey]);
  addTopic({title: concepts[0].title, content: concepts[0].content});
});

const playTimeout = 1 * 60 * 1000;
let index = 0;
let timerId = setTimeout(function tick() {
  chrome.storage.local.get([storageKey]).then(topics => {
    const concepts = getConcepts(topics);

    if (!concepts.length)
      return;
    if (index === concepts.length - 1) {
      index = 0;
      concepts[concepts.length - 1].playing = false;
    } else {
      index += 1;
      concepts[index - 1].playing = false;
    }

    concepts[index].views += 1;
    concepts[index].playing = true;
    storage.set(storageKey, topics[storageKey]);
    addTopic({title: concepts[index].title, content: concepts[index].content});
    timerId = setTimeout(tick, playTimeout); 
  });
}, playTimeout);
/* eslint-enable */
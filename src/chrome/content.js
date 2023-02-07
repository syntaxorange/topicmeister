import storage from "../storage";
import Box from "./box";

/* eslint-disable */
export default class Content extends Box {
  constructor() {
    super();
  }

  getConcepts(topics, all = false) {
    return topics[this.storageKey]
            .filter(topic => topic.concepts.length)
            .map(topic => topic.concepts.filter(concept => all ? concept : concept.play)).flat();
  }
  
  getPlayingConceptIndex(concepts) {
    return concepts.findIndex(o => o.playing);
  }

  playConcept(topics, concept, { isUpdateCounter, isStorage, startTime, isAddTopic}) {
    if (isUpdateCounter) {
      concept.views += 1;
      concept.playing = true;
      concept.startTime = startTime;
    }
    if (isStorage)
      storage.set(this.storageKey, topics[this.storageKey]);
    if (isAddTopic)
      this.addBox({title: concept.title, content: concept.content});
  }

  stopConcept(topics, concept) {
    if (concept) {
      concept.playing = false;
      concept.startTime = null;
    }
    storage.set(this.storageKey, topics[this.storageKey]);
    document.getElementById('topic_meister_topic').remove();
  }

  switchConcept(topics) {
    if (!Object.keys(topics).length) {
      clearTimeout(timerId);
      return;
    }
    const concepts = this.getConcepts(topics);
    
    if (!concepts.length) {
      clearTimeout(timerId);
      return;
    }
    let index = this.getPlayingConceptIndex(concepts);
    if (index === concepts.length - 1) {
      const concept = concepts[index];
      concept.playing = false;
      concept.startTime = null;
      index = 0;
    } else {
      const concept = concepts[index];
      concept.playing = false;
      concept.startTime = null;
      index += 1;
    }
    
    const concept = concepts[index];
    // playTimeout = playTime;
    this.playConcept(topics, concept, { isUpdateCounter: true, isStorage: true, startTime: (new Date()).getTime(), isAddTopic: true });
  }

  init() {
    storage.get(this.storageKey).then(topics => {
      if (!Object.keys(topics).length)
        return;
      const concepts = this.getConcepts(topics);
     
      if (!concepts.length)
        return;
      const index = this.getPlayingConceptIndex(concepts);
  
      if (index < 0)
        return;
  
      const concept = concepts[index];
      chrome.runtime.sendMessage({ isLoaded: true, id: concept.id, topicId: concept.topicId, topics: topics[this.storageKey] });
  
      // this.playConcept(topics, concepts[index], { isUpdateCounter: false, isStorage: false });
      // const topic = document.getElementById('topic_meister_topic');
  
      // storage.get(storageKeyToogle).then(result => {
      //   if (result[storageKeyToogle] === undefined)
      //     return;
  
      //   this.toggle = result[storageKeyToogle];
      //   this.toggleTopic({ 
      //     topic, 
      //     topicContainer: topic.firstElementChild, 
      //     topicToggle: topic.lastElementChild.firstElementChild, 
      //     topicSwitch: topic.lastElementChild.lastElementChild
      //    });
      // });
      
      // const timeLeft = (new Date).getTime() - concepts[index].startTime;
      // playTimeout = timeLeft > playTime ? 0 : playTime - timeLeft;
      // console.log('%c%s', 'color: #1995d7', playTimeout * 0.001 / 60);
      // runTimer();
    });
    
    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
      if (sender.id !== chrome.runtime.id)
        return;
      const { id, play, isLoaded, isSwitchConcept, topicId, topics, change, remove } = data;
  
      if (isSwitchConcept) {
        this.switchConcept(topics);
        sendResponse();
        return;
      }
  
      const topicsWithStorageKey = { 'topic_meister_topics' : topics };
      const allConcepts = this.getConcepts(topicsWithStorageKey, true);
      const currentConcept = allConcepts.find(o => o.topicId === topicId && o.id === id);
      const startTime = (new Date).getTime();
      
      if (isLoaded) {
        this.addBox({title: currentConcept.title, content: currentConcept.content});
        sendResponse();
        return;
      }
  
      if (change) {
        if (currentConcept.playing) {
          this.playConcept(topicsWithStorageKey, currentConcept, { isUpdateCounter: false, isStorage: true, isAddTopic: true });
          clearTimeout(timerId);
          chrome.runtime.sendMessage({ restartTimer: true });
        } else {
          storage.set(this.storageKey, topics);
        }
  
        return;
      }
  
      if (play) {
        if (!allConcepts.some(o => o.playing)) {
          this.playConcept(topicsWithStorageKey, currentConcept, { isUpdateCounter: true, isStorage: true, startTime, isAddTopic: true });
          sendResponse({ playing: true, startTime });
          chrome.runtime.sendMessage({ restartTimer: true });
        } else {
          storage.set(this.storageKey, topics);
          sendResponse();
        }
      }
  
      if (!play && currentConcept?.playing) {
        this.stopConcept(topicsWithStorageKey, !remove && currentConcept);
        const isSomeConceptPlay = allConcepts.some(o => o.play);
        
        if (isSomeConceptPlay) {
          const someConceptPlay = allConcepts.find(o => o.play);
  
          this.playConcept(topicsWithStorageKey, someConceptPlay, { isUpdateCounter: true, isStorage: true, startTime, isAddTopic: true });
          sendResponse({ playing: false, startTime: null, someId: someConceptPlay.id, someTopicId: someConceptPlay.topicId, someStartTime: startTime });
          const topic = document.getElementById('topic_meister_topic');
          if (this.toggle) {
            this.toggleTopic({ 
              topic, 
              topicContainer: topic.firstElementChild, 
              topicToggle: topic.lastElementChild.firstElementChild, 
              topicSwitch: topic.lastElementChild.lastElementChild
             });
          } else {
            clearTimeout(timerId);
            chrome.runtime.sendMessage({ restartTimer: true });
          }
        } else {
          sendResponse({ playing: false, startTime: null });
        }
      } else {
        storage.set(this.storageKey, topics);
        sendResponse();
      }
    });
  }
}
new Content().init();
/* eslint-enable */
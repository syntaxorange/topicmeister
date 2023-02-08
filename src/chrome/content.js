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

  switch(topics) {
    if (!Object.keys(topics).length) {
      clearTimeout(timerId);
      return;
    }

    const concepts = this.getConcepts({ 'topic_meister_topics' : topics });
    
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
    
    this.play(concepts, topics, concepts[index]);
  }

  toggleConceptPlayingProps(concept, startTime = null, playing = true, views = 1) {
    if (views)
      concept.views += views;
    concept.playing = playing;
    concept.startTime = startTime;
  }

  play(concepts, topics, concept, sendResponse) {
    if (!concepts.some(o => o.playing)) {
      const startTime = (new Date).getTime();
      this.toggleConceptPlayingProps(concept, startTime);
      this.addBox({ title: concept.title, content: concept.content });
      if (!this.toggle)
        chrome.runtime.sendMessage({ isRunTimer: true });
      storage.set(this.storageKey, topics);
      if (sendResponse)
        sendResponse({ playing: true, startTime });
    } else {
      storage.set(this.storageKey, topics);
      sendResponse();
    }
  }

  stop(allConcepts, concept, topics, remove, sendResponse) {
    if (!remove)
      this.toggleConceptPlayingProps(concept, null, false, 0);

    storage.set(this.storageKey, topics);
    this.removeBox();

    const hasSomeConceptPlay = allConcepts.some(o => o.play);
        
    if (hasSomeConceptPlay) {
      const startTime = (new Date).getTime();
      const someConcept = allConcepts.find(o => o.play);

      this.play(allConcepts, topics, someConcept);
      
      sendResponse({ 
        playing: false, 
        startTime: null, 
        someId: someConcept.id, 
        someTopicId: someConcept.topicId, 
        someStartTime: startTime 
      });
    } else {
      sendResponse({ playing: false, startTime: null });
    }
  }

  onMessage() {
    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
      if (sender.id !== chrome.runtime.id)
        return;

      const { id, play, topicId, topics, isLoaded, isSwitch, isChange, isRemove } = data;
      const allConcepts = this.getConcepts({ 'topic_meister_topics' : topics }, true);
      const currentConcept = id && allConcepts.find(o => o.topicId === topicId && o.id === id);
      
      if (isLoaded) {
        this.addBox({title: currentConcept.title, content: currentConcept.content});
        sendResponse();
      }

      if (isSwitch) {
        this.switch(topics);
        sendResponse();
      }

      if (isChange) {
        if (currentConcept.playing) {
          this.addBox({ title: currentConcept.title, content: currentConcept.content });
          storage.set(this.storageKey, topics);
          chrome.runtime.sendMessage({ isRunTimer: true });
        } else {
          storage.set(this.storageKey, topics);
        }
        sendResponse();
      }

      if (isRemove)
        this.stop(allConcepts, currentConcept, topics, isRemove, sendResponse);
  
      if (play === undefined)
        return;

      if (play) {
        this.play(allConcepts, topics, currentConcept, sendResponse);
      } else {
        if (currentConcept?.playing) {
          this.stop(allConcepts, currentConcept, topics, false, sendResponse);
        } else {
          storage.set(this.storageKey, topics);
          sendResponse();
        }
      }
    });
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

      chrome.runtime.sendMessage({ 
        isLoaded: true, 
        id: concept.id, 
        topicId: concept.topicId,
        topics: topics[this.storageKey], 
        concept
      });
    });
    
    this.onMessage();
  }
}

new Content().init();
/* eslint-enable */
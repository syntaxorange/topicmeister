/* eslint-disable */
import storage from "../storage";

class Background {
  constructor() {
    this.storageKey = 'topic_meister_topics';
    this.timerId = 0;
    this.playTime = 10000;
    this.playTimeout = this.playTime;
  }

  runTimer() {
    this.timerId = setTimeout(async function tick() {
      if (!chrome.tabs)
        return;
      
      const topics = await storage.get(this.storageKey);
      const tabs = await chrome.tabs.query({});
  
      for (let i = 0; i < tabs.length; ++i) {
        const currentTabId = tabs[i].id;
        const message = { isSwitchConcept: true, topics };
  
        chrome.tabs.sendMessage(currentTabId, message, data => {});
      }

      this.timerId = setTimeout(tick.bind(this), this.playTimeout); 
    }.bind(this), this.playTimeout);
  }

  stopTimer() {
    clearTimeout(this.timerId);
    this.timerId = 0;
  }

  init() {
    chrome.runtime.onMessage.addListener(async request => {
      const { isLoaded, isSwitchConcept, restartTimer, stopTimer, topics } = request;
    
      if (!chrome.tabs && !request)
        return;

      if (isLoaded || isSwitchConcept) {
        const tabs = await chrome.tabs.query({});
    
        for (let i = 0; i < tabs.length; ++i) {
          const currentTabId = tabs[i].id;
          let message = null;

          if (isLoaded)
            message = { id: request.id, topicId: request.topicId, topics: request.topics, isLoaded };

          if (isSwitchConcept) {
            this.stopTimer();
            message = { isSwitchConcept, topics };
          }
    
          chrome.tabs.sendMessage(currentTabId, message, () => {});
        }
    
        if (!this.timerId)
          this.runTimer();
      } else if (restartTimer) {
        this.stopTimer();
        this.runTimer();
      } else if (stopTimer) {
        this.stopTimer();
      }
    });
  }
}

new Background().init();
/* eslint-enable */
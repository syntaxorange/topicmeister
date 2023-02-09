/* eslint-disable */
import storage from "../storage";

class Background {
  constructor() {
    this.storageKey = 'topic_meister_topics';
    this.timerId = 0;
    this.playTime = 10 * 60 * 1000;
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
        const message = { isSwitch: true, topics: topics[this.storageKey] };
  
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
      const { isLoaded, isSwitch, isRunTimer, isStopTimer, topics, concept } = request;
    
      if (!chrome.tabs && !request)
        return;

      if (isLoaded || isSwitch) {
        const tabs = await chrome.tabs.query({});
    
        for (let i = 0; i < tabs.length; ++i) {
          const tab = tabs[i];

          if (!tab.url)
            continue;

          const currentTabId = tab.id;
          let message = null;

          if (isLoaded) {
            message = { 
              id: request.id, 
              topicId: request.topicId, 
              topics: request.topics, 
              isLoaded 
            }
          }

          if (isSwitch) {
            this.stopTimer();
            message = { isSwitch, topics };
          }
    
          chrome.tabs.sendMessage(currentTabId, message, () => {});
        }
    
        if (isLoaded) {
          const timeLeft = (new Date).getTime() - concept.startTime;
          this.playTimeout = timeLeft > this.playTime ? 0 : this.playTime - timeLeft;
        }

        if (!this.timerId)
          this.runTimer();

        this.playTimeout = this.playTime;
      } else if (isRunTimer) {
        this.stopTimer()
        this.runTimer();
      } else if (isStopTimer) {
        this.stopTimer();
      }
    });
  }
}

new Background().init();
/* eslint-enable */
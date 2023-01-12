/* eslint-disable */
export default {
  get(key) {
    return chrome.storage.local.get([key]);
  },
  set(key, value) {
    chrome.storage.local.set({[key]: value});
  },
  remove(key) {
    chrome.storage.local.remove([key]);
  },
  clear() {
    chrome.storage.local.clear();
  }
}
/* eslint-enable */

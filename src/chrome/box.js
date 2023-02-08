/* eslint-disable */
import storage from "../storage";
import { marked } from 'marked';

export default class Box {
  constructor() {
    this.storageKeyCoor = 'topic_meister_topic_coor';
    this.storageKeyToogle = 'topic_meister_topic_toggle';
    this.storageKey = 'topic_meister_topics';
    this.toggle = false;
    this.moveState = {
      bound: null,
      x: 0,
      y: 0,
      move: false
    }
  }
  
  getBox() {
    return document.getElementById('topic_meister_topic');
  }

  getBoxPosition(boxOffset, e) {
    const { clientX: x, clientY: y } = e;
    const { x: boxOffsetX, y: boxOffsetY } = boxOffset;
  
    return {
      'x': x - boxOffsetX + 'px',
      'y': y - boxOffsetY + 'px'
    }
  }

  getBoxOffset(e) {
    const y = e.clientY - e.currentTarget.offsetTop;
    const x = e.clientX - e.currentTarget.offsetLeft;
  
    return { x, y };
  }

  getStyledBox() {
    const box = document.createElement('div');

    box.id = 'topic_meister_topic';
    box.style.fontFamily = "'Roboto', sans-serif";
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.right = '10px';
    box.style.zIndex = '99999';
    box.style.width = '550px';
    box.style.minHeight = '114px';
    box.style.opacity = '.7';

    return box;
  }

  getStyledBoxContainer() {
    const boxContainer = document.createElement('div');
    
    boxContainer.style.position = 'relative';
    boxContainer.style.zIndex = '1';
    boxContainer.style.display = 'flex';
    boxContainer.style.alignContent = 'space-between';
    boxContainer.style.flexWrap = 'wrap';
    boxContainer.style.boxSizing = 'border-box';
    boxContainer.style.width = '100%';
    boxContainer.style.minHeight = '114px';
    boxContainer.style.padding = '15px';
    boxContainer.style.borderRadius = '5px';
    boxContainer.style.backgroundColor = '#ffffff';
    boxContainer.style.boxShadow = '0 3px 4px rgba(0, 0, 0, 0.25)';

    return boxContainer;
  }

  getStyledBoxContent() {
    const boxContent = document.createElement('div');

    boxContent.style.fontSize = '14px';
    boxContent.style.lineHeight = '130%';
    boxContent.style.width = '100%';
    boxContent.style.marginBottom = '8px';
    boxContent.style.color = '#1c1c1c';

    return boxContent;
  }

  getStyledBoxtitle() {
    const boxTitle = document.createElement('div');

    boxTitle.style.fontSize = '12px';
    boxTitle.style.width = '100%';
    boxTitle.style.color = '#464646';

    return boxTitle;
  }

  getStyledBoxControls() {
    const boxControls = document.createElement('div');

    boxControls.style.position = 'absolute';
    boxControls.style.lineHeight = '60px';
    boxControls.style.left = '0';
    boxControls.style.bottom = '0';
    boxControls.style.width = '60px';
    boxControls.style.height = '60px';
    boxControls.style.textAlign = 'center';
    boxControls.style.color = '#202124';
    boxControls.style.borderRadius = '100%';
    boxControls.style.backgroundColor = '#ffffff';
    boxControls.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.25)';
    boxControls.style.transition = 'all 0.2s linear';

    return boxControls;
  }

  getStyledBoxSwitch() {
    const boxSwitch = document.createElement('div');

    boxSwitch.type = 'button';
    boxSwitch.style.width = '100%';
    boxSwitch.style.height = '30px';

    return boxSwitch;
  }

  getStyledBoxToggle() {
    const boxToggle = document.createElement('div');

    boxToggle.type = 'button';
    boxToggle.style.fontSize = '14px';
    boxToggle.style.width = '100%';
    boxToggle.style.height = '30px';

    return boxToggle;
  }

  moveBox(e) {
    if (!chrome.runtime?.id)
      alert('Extension context invalidated. Please reload page.');
    const boxOffset = this.getBoxOffset(e);
  
    this.moveState.bound = (e) => {
      const { x, y } = this.getBoxPosition.call(e.currentTarget, boxOffset, e);
  
      e.currentTarget.style.right = '';
      e.currentTarget.style.left = x;
      e.currentTarget.style.top = y;
      this.moveState.x = x;
      this.moveState.y = y;
    }
    this.moveState.move = true;
  }

  stopMoveBox(box) {
    if (this.moveState.move) {
      if (chrome.runtime?.id)
        storage.set(this.storageKeyCoor, { x: this.moveState.x, y: this.moveState.y });
      box.removeEventListener('mousemove', this.moveState.bound);
      this.moveState.move = false;
    }
  }

  putToDefaultPlace(box) {
    box.style.left = '';
    box.style.right = '10px'
    box.style.top = '10px'
    storage.remove(this.storageKeyCoor);
  }

  putToChangedPlace(box) {
    return new Promise(resolve => {
      storage.get(this.storageKeyCoor).then(result => {
        const coor = result[this.storageKeyCoor];
    
        if (coor && coor.x && coor.y) {
          box.style.left = coor.x;
          box.style.top = coor.y;
        }

        resolve();
      });
    });
  }

  toggleBox({ box, boxContainer, boxToggle, boxSwitch }) {
    boxContainer.style.display = this.toggle ? 'none' : 'flex';
    boxToggle.style.height = this.toggle ? '100%' : '30px';
    boxToggle.textContent = this.toggle ? 'TM' : '';
    boxSwitch.style.height = this.toggle ? '0' : '30px';
    box.style.top = this.toggle ? '0' : '10px';
    box.style.right = this.toggle ? '-480px' : '10px';
    box.style.left = '';
    
    if (this.toggle) {
      chrome.runtime.sendMessage({ isStopTimer: true });
    } else {
      storage.remove(this.storageKeyToogle);
      this.putToChangedPlace(box);
      chrome.runtime.sendMessage({ isRunTimer: true });
    }
  }

  removeBox() {
    const existingBox = this.getBox();

    if (existingBox)
      existingBox.remove();
  }

  async addBox({ title, content }) {
    this.removeBox();
    const body = document.querySelector('body');
    const box = this.getStyledBox();
    const boxContainer = this.getStyledBoxContainer();
    const boxContent = this.getStyledBoxContent();
    const boxTitle = this.getStyledBoxtitle();
    const boxControls = this.getStyledBoxControls();
    const boxSwitch = this.getStyledBoxSwitch();
    const boxToggle = this.getStyledBoxToggle();
  
    boxContent.innerHTML = marked.parse(content, (err, html) => {
      html = html.replace(/<ul>/g, '<ul style="padding-left: 20px; margin: 8px 0;">')
        .replace(/<code>/g, '<code style="padding: 0.2em 0.4em; margin: 0; font-size: 85%; background: #1b1f230d; border-radius: 3px;">')
        .replace(/<p>/g, '<p style="margin: 0 0 10px;">');
      return html;
    });
    boxTitle.textContent = title;
    
    box.appendChild(boxContainer);
    boxContainer.appendChild(boxContent);
    boxContainer.appendChild(boxTitle);
    boxControls.appendChild(boxToggle);
    boxControls.appendChild(boxSwitch);
    box.appendChild(boxControls);
    await this.putToChangedPlace(box);
    storage.get(this.storageKeyToogle).then(data => {
      this.toggle = data[this.storageKeyToogle];

      if (this.toggle)
        this.toggleBox({ box, boxContainer, boxToggle, boxSwitch });

      body.appendChild(box);
      this.bindTopicEvents({box, boxControls, boxContainer, boxToggle, boxSwitch});
    });
  }

  bindTopicEvents({ box, boxControls, boxContainer, boxToggle, boxSwitch }) {
    box.addEventListener('mouseenter', () => {
      box.style.opacity = '1';
      if (!this.toggle) {
        boxControls.style.left = '-20px';
        boxControls.style.bottom = '-20px';
      }
    });

    box.addEventListener('mouseleave', () => {
      box.style.opacity = '.7';
      boxControls.style.left = '0';
      boxControls.style.bottom = '0';
    });

    box.addEventListener('mousedown', (e) => {
      this.moveBox(e);
      box.addEventListener('mousemove', this.moveState.bound);
    });

    box.addEventListener('mouseleave', () => {
      this.stopMoveBox(box);
    });

    box.addEventListener('mouseup', () => {
      this.stopMoveBox(box);
    });

    box.addEventListener('dblclick', () => {
      this.putToDefaultPlace(box);
    });

    boxSwitch.addEventListener('click', () => {
      storage.get(this.storageKey).then(topics => {
        chrome.runtime.sendMessage({ isSwitch: true, topics: topics[this.storageKey] });
      });
    });

    boxToggle.addEventListener('click', () => {
      this.toggle = !this.toggle;
      this.toggleBox({ box, boxContainer, boxToggle, boxSwitch });
      storage.set(this.storageKeyToogle, this.toggle);
    });
  }
}
/* eslint-enable */
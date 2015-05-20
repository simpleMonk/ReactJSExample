var alt = require('../alt');

class MyActions {
  constructor() {
    this.generateActions('postMessage');
  }
}

module.exports = alt.createActions(MyActions);

"use strict"
var alt = require('../alt');
var MyActions = require('../actions/MyActions');


class MyStore {
  constructor() {
    this.messages =[];
    this.bindActions(MyActions)
  }

  onPostMessage(message){
    console.log("called onPostMessage",message);
    this.messages.push({title:message});
  }
}

module.exports = alt.createStore(MyStore, 'MyStore');

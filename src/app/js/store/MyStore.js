"use strict";

import alt from"../alt";
import MyActions from "../actions/MyActions";


class MyStore {
  constructor() {
    this.messages = [];
    this.bindActions(MyActions);
  }

  onPostMessage(message){
    console.log("called onPostMessage**", message);
    this.messages.push({title: message});
  }
}

export default alt.createStore(MyStore, "MyStore");

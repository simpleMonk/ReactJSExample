"use strict";

import alt from "../alt";

class MyActions {
  constructor() {
    this.generateActions("postMessage");
  }
}

export default alt.createActions(MyActions);

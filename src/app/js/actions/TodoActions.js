"use strict";

import alt from "../alt";

class TodoActions {
	constructor() {
		this.generateActions("addTodo", "deleteTodo");
	}
}

export default alt.createActions(TodoActions);

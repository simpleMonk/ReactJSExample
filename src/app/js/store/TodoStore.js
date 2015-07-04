"use strict";

import alt from "../alt";
import TodoActions from "../actions/TodoActions";

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
		s4() + "-" + s4() + s4() + s4();
}


class TodoStore {
	constructor() {
		this.todos = [{id: guid(), title: "First Todo"}];
		this.bindActions(TodoActions);
	}

	onAddTodo(todo) {
		this.todos.push({title: todo, id: guid()});
	}

	onUpdateTodo() {

	}

	onDeleteTodo(id) {
		console.log("Delete it from todos", id);
		this.todos = this.todos.filter(function(todo) {
			return todo.id !== id;
		});

	}
}
export default alt.createStore(TodoStore, "TodoStore");

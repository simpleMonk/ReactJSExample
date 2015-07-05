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
		this.bindActions(TodoActions);
		this.todos = [{id: guid(), title: "First Todo"}];
	}

	onAddTodo(todo) {
		const todos = this.todos;
		this.setState({
			todos: todos.concat({title: todo, id: guid()})
		});
		console.log(this.todos, this);
	}

	onDeleteTodo(id) {
		console.log('called delete', id);
		const todos = this.todos.filter(function(todo) {
			return todo.id !== id;
		});

		this.setState({
			todos: todos,
		});

	}
}
export default alt.createStore(TodoStore);

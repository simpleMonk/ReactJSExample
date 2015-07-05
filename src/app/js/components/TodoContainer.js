"use strict";
import React from "react";
import TodoActions from "../actions/TodoActions";
import TodoStore from "../store/TodoStore";

export default class TodoContainer extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = TodoStore.getState();
	}

	componentDidMount() {
		TodoStore.listen(this.onChange);
	}

	componentWillUnmount() {
		TodoStore.unlisten(this.onChange);
	}

	render() {
		return (
			<div>Todos:
				<button onClick={() => this.handleAddTodo()}>Add Todo</button>
				<hr></hr>
				{this.state.todos.map(todo =>
						<div key={todo.id} onClick={() => this.handleDeleteTodo(todo.id)}>{todo.title}</div>
				)}
			</div>
		);
	}

	onChange(state) {
		console.log(this, TodoStore, state);
		this.setState(state);
	}

	handleAddTodo() {
		TodoActions.addTodo("Todo--" + Math.floor(Math.random() * 11));
	}

	handleDeleteTodo(id) {
		TodoActions.deleteTodo(id);
	}
}
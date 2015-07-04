"use strict";
import React from "react";
import TodoActions from "../actions/TodoActions";
import TodoStore from "../store/TodoStore";

var TodoContainer = React.createClass({
  getInitialState() {
    return TodoStore.getState();
  },
  componentDidMount() {
    TodoStore.listen(this._onChange);
  },
  componentWillUnmount() {
    TodoStore.listen(this._onChange);
  },
  render() {
    var todos = this.state.todos.map(function (todo) {
      return <div key={todo.id} onClick={this._deleteTodo.bind(this, todo.id)}>{todo.title}</div>;
    }.bind(this));

    return (
      <div>Todo reload:
        <button onClick={this._addTodo}>Add Todo</button>
        <hr></hr>
          {{todos}}
      </div>
    );
  },
  _onChange(state) {
    this.setState(state);
  },
  _addTodo() {
    TodoActions.addTodo("Todo--" + Math.floor(Math.random() * 11));
  },
  _deleteTodo(id) {
    TodoActions.deleteTodo(id);
  }

});

React.render(<TodoContainer/>, document.getElementById("container"));

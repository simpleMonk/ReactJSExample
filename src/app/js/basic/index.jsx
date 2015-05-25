"use strict"
import React from 'react';
import MyActions from '../actions/MyActions';
import MyStore from '../store/MyStore';

var getMyStore = function () {
  return {
    messages: MyStore.getState().messages
  }
};

var HelloWorld = React.createClass({

  getInitialState() {
    return getMyStore();
  },
  componentDidMount() {
    MyStore.listen(this._onChange);
  },

  componentWillUnmount() {
    MyStore.unlisten(this._onChange);
  },
  render() {
    var thisMessage =[];

    for (var message in this.state.messages) {
      thisMessage.push(<div key={message.id}>{this.state.messages[message]}</div>);
    }

    return <div onClick={this._onClick}>
      Hello World from React!!!!
      <hr/>
      {thisMessage}
    </div>
  },
  _onClick() {
    MyActions.postMessage("Message-" + Math.floor(Math.random() * 11));
  },
  _onChange: function (state) {
    this.setState(state);
  }

});



React.render(<HelloWorld/>, document.getElementById('container'));

import React from 'react';

var HelloWorld=React.createClass({
  render(){
    return <div>Hello World from REACT!</div>
  }
});


React.render(<HelloWorld/>,document.getElementById('container'));

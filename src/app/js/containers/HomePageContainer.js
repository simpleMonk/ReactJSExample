import React from  'react';
import TodoContainer from "../components/TodoContainer";
import Hello from "../components/HelloMessage";
import Counter from "../components/Counter";

export default class HomePageContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Counter initialCount={this.props.initialCount}/>
				<hr/>
				<Hello name={this.props.name}/>
				<hr/>
				<TodoContainer/>
				<TodoContainer/>
			</div>
		);
	}
}

HomePageContainer.defaultProps = {initialCount: 0, name: "Senthil Kumar"};

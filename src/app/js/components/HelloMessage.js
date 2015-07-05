"use strict";
import React from "react";

export default class HelloMessage extends React.Component {
	constructor() {
		super();
	}

	render() {
		return <div>Hello {this.props.name}</div>;
	}
}

import React, { Component } from 'react'

class SimpleStep extends Component {

	render () {
		let noteLabel = this.props.step.notes ? " Notes: " : ""; 
		return(
			<div className="simpleStep">
					<b>{this.props.step.project.title}: </b>
				{this.props.step.step_text} <span className={"stepLabel category-" + this.props.step.category}>{this.props.step.category}</span>
				<br /><span className="notes"><b className='noteLabel'>{noteLabel}</b>{this.props.step.notes}</span>
			</div>
		)
	}
}

export default SimpleStep
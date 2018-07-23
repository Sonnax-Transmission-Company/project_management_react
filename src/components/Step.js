import React, { Component } from 'react'

class Step extends Component {

	render () {
		let tileClasses = this.props.step.current === true ? "stepTile current" : "stepTile";
		let noteLabel = this.props.step.notes ? " Notes: " : ""; 
		let currentLabelClasses = this.props.step.current === true ? "stepLabel currentLabel" : "";
		let currentLabel = this.props.step.current === true ? "In Progress" : "" ;
		return(
			<div className={tileClasses}>
				<span className="completeBox"> {this.props.step.complete === true ? "☑" : "•"} </span>{this.props.step.step_text} <span className={"stepLabel category-" + this.props.step.category}>{this.props.step.category}</span> <span className={currentLabelClasses}>{currentLabel}</span>
				<span className="notes"><b className='noteLabel'>{noteLabel}</b>{this.props.step.notes}</span>
			</div>
		)
	}
}

export default Step
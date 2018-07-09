import React, { Component } from 'react'

import Step from './Step'

class InactiveProject extends Component {
	constructor(props) {
		super(props)
	}

	handleDelete = () => {
	  this.props.onDelete(this.props.project.id)
	}

	render () {
		const fdd = (new Date(this.props.project.due_date)).toLocaleDateString();
		const fcd = (new Date(this.props.project.complete_date)).toLocaleDateString();
		let stars = [...Array(this.props.project.priority)].map((e, i) => <span className="priorityStars" key={i}>★</span>)
		let noteLabel = this.props.project.notes ? "Notes: " : ""; 
		let dueLabel = this.props.project.due_date ? "Due: " : "";
		let completeLabel = this.props.project.complete_date ? " | Complete: " : ""; 
		return(
			<div className={"inactiveTile tile-" + this.props.project.status}>
				<h4><span className="title">{this.props.project.title}</span> <span className={"label pl-" + this.props.project.product_line}>{this.props.project.product_line}</span>  <span className={"label status-" + this.props.project.status}>{this.props.project.status}</span></h4>
				<p><b>{dueLabel}</b><span className="dueDate">{fdd}</span><b>{completeLabel}</b><span className="dueDate">{fcd}</span></p>
				<p>{this.props.project.request}</p>
				<span className="notes"><b>{noteLabel}</b>{this.props.project.notes}</span>
				<div>
					{this.props.project.steps.map((step, i) => {
					  return(<Step step={step} key={step.id} />)
					})}
				</div>
			</div>
		)
	}
}

export default InactiveProject
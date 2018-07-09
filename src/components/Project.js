import React, { Component } from 'react'

import Step from './Step'

class Project extends Component {
	constructor(props) {
		super(props)
		this.state = {
			steps: this.props.project.steps ? this.props.project.steps : [],
			editingStepId: null,
			draggingStepId: null,
			stepNotification: ''
		}
	}

	handleClick = () => {
		this.props.onClick(this.props.project.id)
	}

	handleDelete = () => {
	  this.props.onDelete(this.props.project.id)
	}
	

	render () {
		const fdd = (new Date(this.props.project.due_date)).toLocaleDateString();
		let stars = [...Array(this.props.project.priority)].map((e, i) => <span className="priorityStars" key={i}>★</span>)
		let noteLabel = this.props.project.notes ? "Notes: " : ""; 
		let dueLabel = this.props.project.due_date ? "Due: " : ""; 
		return(
			<div className={"tile tile-" + this.props.project.status} onClick={this.handleClick}>
				<span className="deleteButton" onClick={this.handleDelete}>
			    x
			  </span>
				<h4><span className="title">{this.props.project.title} {stars}</span> <span className={"label pl-" + this.props.project.product_line}>{this.props.project.product_line}</span>  <span className={"label status-" + this.props.project.status}>{this.props.project.status}</span> <span className="date"><b>{dueLabel}</b><span className="dueDate">{fdd}</span></span></h4>
				<p>{this.props.project.request}</p>
				<span className="notes"><b>{noteLabel}</b>{this.props.project.notes}</span>
				<div onDragOver={this.dragOver}>
					{this.state.steps.map((step, i) => {
						return(
							<Step step={step} key={step.id} />
						)
					})}
				</div>
			</div>
		)
	}
}

export default Project
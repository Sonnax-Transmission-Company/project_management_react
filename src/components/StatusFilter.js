import React, { Component } from 'react'

class StatusFilter extends Component {

	handleSelect(e) {
		this.props.filterStatus(e.target.value)
	}

	render() {
		return(
			<div className="filterBox">
				<label>Status</label>
				<select className='select' name="statusFilter" onChange={this.handleSelect.bind(this)}>
        	<option value="All">All</option>
        	<option value="Open">Open</option>
        	<option value="Waiting">Waiting</option>
        	<option value="Complete">Complete</option>
        	<option value="Closed">Closed</option>
        </select>
			</div>
		)
	}
}

export default StatusFilter
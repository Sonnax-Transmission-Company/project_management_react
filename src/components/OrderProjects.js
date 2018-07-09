import React, { Component } from 'react'

class OrderProjects extends Component {

	handleSelect(e) {
		this.props.orderProjects(e.target.value)
	}

	render() {
		return(
			<div className="filterBox">
				<label>Order</label>
				<select className='select' name="orderFilter" onChange={this.handleSelect.bind(this)}>
        	
        	<option value="Priority">Priority ↓</option>
        	<option value="Date">Date ↓</option>
        </select>
			</div>
		)
	}
}

export default OrderProjects
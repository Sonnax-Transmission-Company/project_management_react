import React, {Component} from 'react'
import axios from 'axios'

import AutosizeInput from 'react-input-autosize';

class StepForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
      project_id: this.props.step.project_id, 
			step_text: this.props.step.step_text,
			complete: this.props.step.complete,
			category: this.props.step.category,
      current: this.props.step.current,
			notes: this.props.step.notes,
			order: this.props.step.order
		}
	}

	handleInput = (e) => {
		const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value})
  }

  handleBlur = () => {
  	const step = {
  		project_id: this.state.project_id,
			step_text: this.state.step_text,
			complete: this.state.complete,
			category: this.state.category,
			current: this.state.current,
			notes: this.state.notes,
			order: this.state.order
  	}
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
  	axios.put(
  		`https://sonnax-project-management.herokuapp.com/api/v1/steps/${this.props.step.id}`,
  		{
  			step: step
  		}, config
  	).then(response => {
  		console.log(response)
  		this.props.updateStep(response.data)
  		}
  	).catch(error => console.log(error))
    this.props.resetStepEditingId()

  }

  handleDelete = () => {
    this.props.onDelete(this.props.step.id)
  }

  handleMoveUp = (e) => {
    this.props.moveStepUp(this)
  }

  handleMoveDown = (e) => {
    this.props.moveStepDown(this)
  }

	render() {
		return (
			<div className="stepTile">
        <span className="deleteStepButton" onClick={this.handleDelete}>
          x
        </span>
        <span className="deleteStepButton" onClick={this.handleMoveUp}>
          ↑
        </span>
        <span className="deleteStepButton" onClick={this.handleMoveDown}>
          ↓
        </span>
				<form onBlur={this.handleBlur}>
          <input
              name="complete"
              type="checkbox"
              checked={this.state.complete}
              onChange={this.handleInput} className="completeBoxInput" />&nbsp;
          <AutosizeInput name="step_text" placeholder="step text" value={this.state.step_text} onChange={this.handleInput} />&nbsp;
          <label className="stepLabel currentLabel">
            In Progress
            <input
              name="current"
              type="checkbox"
              checked={this.state.current}
              onChange={this.handleInput} />
          </label>&nbsp;
          <span className="stepLabel">
            <select className='select input' name="category" value={this.state.category} onChange={this.handleInput}>
              <option value="">Category</option>
              <option value="Bug">Bug</option>
              <option value="Data">Data</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Page Update">Page Update</option>
              <option value="Print">Print</option>
              <option value="Other">Other</option>
            </select>
          </span>&nbsp;
          <span className="notes">
          <b>Notes: </b> 
          <AutosizeInput name="notes" value={this.state.notes} onChange={this.handleInput} placeholder="notes about step" />
          </span>
          <input className='input hidden' type="number"
            name="order" value={this.state.order} onChange={this.handleInput} />
				</form>
			</div>
		);
	}
}

export default StepForm
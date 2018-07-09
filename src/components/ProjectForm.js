import React, {Component} from 'react'

import StepForm from './StepForm'

import axios from 'axios'
import update from 'immutability-helper'
import AutosizeInput from 'react-input-autosize';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';


class ProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.project.title,
      priority: this.props.project.priority,
      request: this.props.project.request,
      notes: this.props.project.notes,
      status: this.props.project.status,
      product_line: this.props.project.product_line,
      no_steps: this.props.project.no_steps,
      due_date: this.props.project.due_date,
      complete_date: this.props.project.complete_date,
      steps: this.props.project.steps ? this.props.project.steps : [],
      editingStepId: null,
      draggingStepId: null,
      stepNotification: ''
    }
  }

  handleDay = (day, {selected}) => {
    if (selected) {
      // Unselect the day if already selected
      this.setState({ due_date: undefined });
      return;
    }
    this.setState({ due_date: day });
  }

  updateStep = (step) => {
    const stepIndex = this.state.steps.findIndex(x => x.id === step.id)
    const steps = update(this.state.steps, {
      [stepIndex]: { $set: step }
    });
    this.setState({
      steps: steps
    })
    this.handleBlur()
  }

  resetStepNotification = () => {
    this.setState({stepNotification: ''})
  }

  resetStepEditingId = () => {
    this.setState({editingStepId: null})
  }

  enableStepEditing = (id) => {
    this.setState({editingStepId: id})
  }

  deleteStep = (id) => {
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.delete(`http://127.0.0.1:3002/api/v1/steps/${id}`, config)
    .then(response => {
      const stepIndex = this.state.steps.findIndex(x => x.id === id)
      const steps = update(this.state.steps, { $splice: [[stepIndex, 1]]})
      this.setState({steps: steps})
    })
    .catch(error => console.log(error))
  }

  dragStep = (id) => {
    this.setState({draggingStepId: id})
  }



  // drag and drop
  dragEnd = (t) => {
    let orig_steps = this.state.steps;
    const first_slice = orig_steps.splice(this.state.draggingStepId, 1)[0]
    orig_steps.splice(t, 0, first_slice);
    this.setState({steps: orig_steps});
    this.state.steps.map((s, i) => {
      if (s.order !== i) {
        const step = {
          order: i
        }
        let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
        axios.put(
          `http://127.0.0.1:3002/api/v1/steps/${s.id}`,
          {step: step}, config
        ).then(response => {
          }
        ).catch(error => console.log(error))
      }
    });
  }

  handleProjectInput = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value})
    if (name === 'status' && value === 'Complete') {
      const jsTime = Date.now();
      this.setState({complete_date: jsTime, priority: 0});
      this.state.steps.map((s, i) => {
        if (s.complete === false || s.current === true) {

          console.log("step " + i)
          console.log(s)

          let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};

          const step = {
            complete: true,
            category: false
          }
          axios.put(
          `http://127.0.0.1:3002/api/v1/steps/${s.id}`,
          {step: step}, config
        ).then(response => {
          }
        ).catch(error => console.log(error))
        }
      })

    }
  }

  handleStar = (e) => {
    const target = e.target;
    this.setState({priority: target.value})
  }

  handleFinishEditing = () => {
    this.props.stopEditingProject(this.props.project.id)
  }

  handleBlur = () => {
    const project = {
      title: this.state.title,
      priority: this.state.priority,
      request: this.state.request,
      notes: this.state.notes,
      status: this.state.status,
      product_line: this.state.product_line,
      no_steps: this.state.no_steps,
      due_date: this.state.due_date,
      complete_date: this.state.complete_date,
      steps_attributes: this.state.steps,
      steps: this.state.steps
    }
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.put(
      `http://127.0.0.1:3002/api/v1/projects/${this.props.project.id}`,
      {
        project: project
      }, config
    ).then(response => {
      this.props.updateProject(response.data)
      }
    ).catch(error => console.log(error))
  }

  

  addNewStep = (e) => {
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.post(
      'http://127.0.0.1:3002/api/v1/steps',
      {
        step: {
          project_id: this.props.project.id,
          step_text: "",
          complete: false,
          category: "",
          current: false,
          notes: "",
          status: "",
          order: 0
        }
      },
      config
    )
    .then(response => {
      const steps = update(this.state.steps, {
        $splice: [[0, 0, response.data]]
      })
      this.setState({
        steps: steps,
        editingStepId: response.data.id,
        stepsExist: true
      })
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div id="projectformid" className="tile">
        <form onBlur={this.handleBlur}>
          <h4>
          <span className="title">
            <AutosizeInput ref={this.props.titleRef} name="title" placeholder='Enter a Title' value={this.state.title} onChange={this.handleProjectInput} />&nbsp;
            <span className="rating">
            <label>
              <input type="radio" value="1" onChange={this.handleStar} checked={this.state.priority === "1" || this.state.priority === 1}/>
              <span class="icon">★</span>
            </label>
            <label>
              <input type="radio" value="2" onChange={this.handleStar} checked={this.state.priority === "2" || this.state.priority === 2}/>
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
            <label>
              <input type="radio" value="3" onChange={this.handleStar} checked={this.state.priority === "3" || this.state.priority === 3}/>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>   
            </label>
            <label>
              <input type="radio" value="4" onChange={this.handleStar} checked={this.state.priority === "4" || this.state.priority === 4}/>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
            <label>
              <input type="radio" value="5" onChange={this.handleStar} checked={this.state.priority === "5" || this.state.priority === 5}/>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
              <span className="icon">★</span>
            </label>
            </span>
          </span>&nbsp;
          <span className="label">
            <select className='select' name="product_line" value={this.state.product_line} onChange={this.handleProjectInput}>
              <option value="G">G</option>
              <option value="TS">TS</option>
              <option value="TC">TC</option>
              <option value="HP">HP</option>
              <option value="RVB">RVB</option>
              <option value="DL">DL</option>
              <option value="Other">Other</option>
            </select>
          </span>&nbsp;
          <span className="label">
            <select className='select' name="status" value={this.state.status} onChange={this.handleProjectInput}>
              <option value="Open">Open</option>
              <option value="Waiting">Waiting</option>
              <option value="Complete">Complete</option>
              <option value="Closed">Closed</option>
            </select>
          </span>
          
          </h4>

          <span class="date">
            <b>Due: </b>
            <DayPickerInput onDayClick={this.handleDay} selectedDays={this.state.due_date}/>
          </span>
          <br />
          <hr />
          <b>Request Details: </b>
          <textarea className='textarea' name="request"
            placeholder='Describe your idea' value={this.state.request} onChange={this.handleProjectInput}></textarea>
          <span className="notes"><b>Notes: </b><AutosizeInput name="notes" placeholder='Enter Notes' value={this.state.notes} onChange={this.handleProjectInput} /></span>
        </form>
        <div onDragOver={this.dragOver}>
          {this.state.steps.map((step, i) => {
            return(<StepForm step={step} key={step.id} dataId={i} draggable="true" onDrag={this.dragStep} DragEnd={this.dragEnd} stopStepEditing={this.stopStepEditing} updateStep={this.updateStep} handleSteps={this.handleSteps} resetStepEditingId={this.resetStepEditingId} onDelete={this.deleteStep} />)
            })}
        </div>
        <div>
            <button className="newStepButton" onClick={this.addNewStep}>
              + New Step
            </button>
            <br /><button onClick={this.handleFinishEditing} className="newProjectButton">Save</button>
          </div>
      </div>
    );
  }
}

export default ProjectForm
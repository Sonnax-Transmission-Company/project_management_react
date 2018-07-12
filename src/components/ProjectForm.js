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

  handleDay = (day) => {
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
    axios.delete(`https://sonnax-project-management.herokuapp.com/api/v1/steps/${id}`, config)
    .then(response => {
      const stepIndex = this.state.steps.findIndex(x => x.id === id)
      const steps = update(this.state.steps, { $splice: [[stepIndex, 1]]})
      this.setState({steps: steps})
    })
    .catch(error => console.log(error))
  }

  stepOrder = (e) => {
    this.state.steps.map((s, i) => {
      if (s.order !== i) {
        console.log(s.step_text + " order: " + s.order)
        const step = {
          order: i
        }
        let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
        axios.put(
          `https://sonnax-project-management.herokuapp.com/api/v1/steps/${s.id}`,
          {step: step}, config
        ).then(response => {
          this.state.steps[i].order = response.data.order
          this.handleBlur()
          }
        ).catch(error => console.log(error))
      }
    })
  }

  projectComplete = (e) => {
    const jsTime = Date.now();
    this.setState({complete_date: jsTime, priority: 0});
    
    this.state.steps.map((s, i) => {
      if (s.complete === false || s.current === true) {
        this.state.steps[i].complete = true
        this.state.steps[i].current = false
      }
    })
  }

  handleProjectInput = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value})
    if (name === 'status' && value === 'Complete') {
      this.projectComplete()
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
      no_steps: this.props.project.no_steps === false ? true : false,
      due_date: this.state.due_date,
      complete_date: this.state.complete_date,
      steps_attributes: this.state.steps,
      steps: this.state.steps
    }
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.put(
      `https://sonnax-project-management.herokuapp.com/api/v1/projects/${this.props.project.id}`,
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
      'https://sonnax-project-management.herokuapp.com/api/v1/steps',
      {
        step: {
          project_id: this.props.project.id,
          step_text: "",
          complete: false,
          category: "",
          current: false,
          notes: "",
          status: "",
          order: this.state.steps.length + 1
        }
      },
      config
    )
    .then(response => {
      const steps = update(this.state.steps, {
        $push: [response.data]
      })
      this.setState({
        steps: steps,
        editingStepId: response.data.id,
        stepsExist: true
      })
    })
    .catch(error => console.log(error))
  }

  arrayMove = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return(arr);
  }

  moveStepUp = (step) => {
    const from = this.state.steps.findIndex(x => x.id === step.props.step.id)
    const to = from - 1
    let ordered_steps = this.arrayMove(this.state.steps, from, to)
    this.stepOrder()
  }
  moveStepDown = (step) => {
    const from = this.state.steps.findIndex(x => x.id === step.props.step.id)
    const to = from + 1
    let ordered_steps = this.arrayMove(this.state.steps, from, to)
    this.stepOrder()
  }

  render() {
    return (
      <div id="projectformid" className="tile">
        <form onBlur={this.handleBlur}>
          <span class="date">
            <b>Due: </b>
            <DayPickerInput onDayChange={this.handleDay} value={this.state.due_date}/>
          </span>
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
              <option value="">PL</option>
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
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="Waiting">Waiting</option>
              <option value="Complete">Complete</option>
              <option value="Closed">Closed</option>
            </select>
          </span>
          
          </h4>

          
          <br />
          <hr />
          <div className="request clearfix">
            <b>Request Details: </b>
            <textarea className='textarea' name="request"
              placeholder='Describe your idea' value={this.state.request} onChange={this.handleProjectInput}></textarea>
            <span className="notes"><b>Notes: </b><AutosizeInput name="notes" placeholder='Enter Notes' value={this.state.notes} onChange={this.handleProjectInput} /></span>
          </div>
        </form>
        <div onDragOver={this.dragOver}>
          {this.state.steps.map((step, i) => {
            return(<StepForm step={step} key={step.id} stopStepEditing={this.stopStepEditing} updateStep={this.updateStep} resetStepEditingId={this.resetStepEditingId} onDelete={this.deleteStep} moveStepUp={this.moveStepUp} moveStepDown={this.moveStepDown} />)
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
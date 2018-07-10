import React, { Component } from 'react'

import axios from 'axios'
import update from 'immutability-helper'

import SimpleStep from './SimpleStep'

class CompleteContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steps: [],
      allSteps: []
    }
  }

  componentDidMount() {
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.get('https://sonnax-project-management.herokuapp.com/api/v1/steps/complete.json', config)
    .then(response => {
      this.setState({steps: response.data, allSteps: response.data})
    })
    .catch(error => console.log(error)) 
  }

  refreshList = (e) => {
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.get('https://sonnax-project-management.herokuapp.com/api/v1/steps/complete.json', config)
    .then(response => {
      this.setState({steps: response.data, allSteps: response.data})
    })
    .catch(error => console.log(error)) 
  }

  renderSteps = (e) => {
    const steps = this.state.steps;
    if (steps.length > -1) {
    return(
      steps.map((step, i) => {
      return(<li><SimpleStep step={step} key={step.id} /></li>)
      })
    )
    }
  }


  render() {
    return (
      <div className="CompleteContainer">
        <h2>Most Recently Complete</h2>
        <ul>
        {this.renderSteps()}
        </ul>
        <button onClick={this.refreshList}>Refresh</button>
      </div>
    )
  }
}

export default CompleteContainer
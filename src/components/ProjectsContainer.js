import React, { Component } from 'react'

import axios from 'axios'
import update from 'immutability-helper'

import ProjectForm from './ProjectForm'
import Project from './Project'
import InactiveProject from './InactiveProject'
import Search from './Search'
import StatusFilter from './StatusFilter'
import OrderProjects from './OrderProjects'

class ProjectsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      allProjects: [],
      editingProjectID: null,
      notification: ''
    }
  }

  componentDidMount() {
  	let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};

    axios.get('http://127.0.0.1:3002/api/v1/projects.json', config)
    .then(response => {
      this.setState({projects: response.data, allProjects: response.data})
    })
    .catch(error => console.log(error))
  }

  addNewProject = () => {
  	let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.post(
      'http://127.0.0.1:3002/api/v1/projects',
      {
        project: {
          title: "",
          priority: 1,
          request: "",
          notes: "",
          status: "",
          product_line: "",
          no_steps: false,
          steps_attributes: []
        }
      }, config

    )
    .then(response => {
      const projects = update(this.state.projects, {$splice: [[0,0,response.data]]
      })
      this.setState({
        projects: projects,
        allProjects: projects,
        editingProjectID: response.data.id
      })
    })
    .catch(error => console.log(error))
  }

  updateProject = (project) => {
    const projectIndex = this.state.projects.findIndex(x => x.id === project.id)
    const projects = update(this.state.projects, {
      [projectIndex]: { $set: project }
    });
    this.setState({
      projects: projects,
      allProjects: projects
    })
  }

  resetNotification = () => {
    this.setState({notification: ''})
  }

  enableEditing = (id) => {
    this.setState(
      {editingProjectID: id},
      () => { this.title.focus() }
    )
  }

  stopEditingProject = () => {
    this.setState(
      {editingProjectID: null}
    )
  }

  deleteProject = (id) => {
  	let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};
    axios.delete(`http://127.0.0.1:3002/api/v1/projects/${id}`, config)
    .then(response => {
      const projectIndex = this.state.projects.findIndex(x => x.id === id)
      const projects = update(this.state.projects, { $splice: [[projectIndex, 1]]})
      this.setState({projects: projects, allProjects: projects})
    })
    .catch(error => console.log(error))
  }

  finishEditingProject = () => {
    this.setState(
      {editingProjectID: null}
    )
  }

  searchProjects(q) { 
    let projects = this.state.allProjects.filter((project) => {
      let step_text = [];
      project.steps.map((s) => {step_text.push(s.step_text)});
      return (project.title.includes(q) || step_text.toString().includes(q))
    });
    this.setState({projects: projects})
  }

  filterStatus = (q) => {
    if (q === 'All') {
      this.setState({projects: this.state.allProjects});
    }
    else {
      let projects = this.state.allProjects.filter((project) => {
        return project.status.includes(q)
      });
      this.setState({projects: projects})
    }
  }

  orderProjects = (q) => {
    if (q === "Date") {
      let projects = this.state.projects.sort((a,b) => {
        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      }).reverse();
      this.setState({projects: projects})
    } else {
      let projects = this.state.projects.sort((a,b) => {
        return (b.priority - a.priority)
      });
      this.setState({projects: projects})
    }
  }

  render() {
    return (
      <div className="ProjectsContainer">
        <div className="ProjectFilters clearfix">
          <Search searchProjects={this.searchProjects.bind(this)} />
          <StatusFilter filterStatus={this.filterStatus} />
          <OrderProjects orderProjects={this.orderProjects} />
          <div>
            <span className="notification">
              {this.state.notification}
            </span>
          </div>
            <button className="newProjectButton" onClick={this.addNewProject}>
              + New Project
            </button>
        </div>
        <div className="projects clearfix">
        {this.state.projects.map((project) => {
          if(project.status === "Complete") {
            return(
              <InactiveProject project={project} key={project.id} onDelete={this.deleteProject}/>
            )
          }
          else if(this.state.editingProjectID === project.id) {
            return(
              <ProjectForm project={project} key={project.id} stopEditingProject={this.stopEditingProject} updateProject={this.updateProject} titleRef={input => this.title = input} />
            )
          } else {
            return(
              <Project project={project} key={project.id} onClick={this.enableEditing} onDelete={this.deleteProject}  />
            )
          }
        })}
        </div>
      </div>
    )
  }
}

export default ProjectsContainer
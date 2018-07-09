import React, { Component } from 'react';

import axios from 'axios'

import './App.css';
import ProjectsContainer from './components/ProjectsContainer'
import InProgressContainer from './components/InProgressContainer'
import CompleteContainer from './components/CompleteContainer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      token: localStorage.getItem("jwt")
    };
  }

  componentDidMount() {
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};

    axios.get('http://127.0.0.1:3002/api/v1/projects.json', config)
    .catch(error => {
      this.setState({token: null}); localStorage.removeItem("jwt");
    })
  }

  handleLogInInput = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[name]: value})
  }

  login = () => {
    const auth = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post(
      'http://127.0.0.1:3002/user_token',
      {
        auth: auth
      }

    )
    .then(response => {
      console.log(response)
      localStorage.setItem("jwt", response.data.jwt)
      this.setState({token: response.data.jwt})
    })
    .catch(error => console.log(error))
    console.log(this.state.token)
  }

  renderLogIn = (e) => {
    if (!this.state.token || !localStorage.getItem("jwt")) {
      return (
        <div>
          <h3>Log In</h3>
          <form>
            <label htmlFor="email">Email: </label>
            <br />
            <input name="email" id="email" type="email" placeholder='Email' value={this.state.email} onChange={this.handleLogInInput} />
            <br /><br />
            <label htmlFor="password">Password:</label>
            <br />
            <input name="password" id="password" type="password" placeholder='Password' value={this.state.password} onChange={this.handleLogInInput} />
          </form>
          <br />
          <button
            onClick={this.login}
          >
              Login
          </button>
        </div>
      )
    }
  }

  renderProjects = (e) => {
    if (this.state.token || localStorage.getItem("jwt")) {
      return (<ProjectsContainer />)
    }
  }

  renderSteps = (e) => {
    if (this.state.token || localStorage.getItem("jwt")) {
      return (
        <div>
          <InProgressContainer />
          <hr />
          <CompleteContainer />
        </div>
      )
    }
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Projects</h1>
        </header>
        {this.renderProjects()}
        <aside className="sidebar">
          {this.renderLogIn()}
          {this.renderSteps()}
        </aside>
      </div>
    );
  }
}

export default App;

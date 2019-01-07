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
      message: '',
      token: localStorage.getItem("jwt")
    };
  }

  componentDidMount() {
    let config = {headers: {'Authorization': "bearer " + localStorage.getItem("jwt")}};

    axios.get('https://sonnax-project-management.herokuapp.com/api/v1/steps/current.json', config)
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

  logIn = (e) => {
    const auth = {
      email: this.state.email,
      password: this.state.password
    }

    e.preventDefault();
    axios.post(
      'https://sonnax-project-management.herokuapp.com/user_token',
      {
        auth: auth
      }

    )
    .then(response => {
      console.log(response)
      localStorage.setItem("jwt", response.data.jwt)
      this.setState({token: response.data.jwt, message: ''})
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        this.setState({message: 'There was an issue logging in, please try re-entering your information.'})
      }
      else {
        this.setState({message: ''})
      }
    });
  }

  logOut = () => {
    this.setState({token: null}); localStorage.removeItem("jwt");
  }

  renderLogIn = (e) => {
    if (!this.state.token || !localStorage.getItem("jwt")) {
      return (
        <div>
          <h3>Log In</h3>
          <form onSubmit={this.logIn}>
            <label htmlFor="email">Email: </label>
            <br />
            <input name="email" id="email" type="email" placeholder='Email' value={this.state.email} onChange={this.handleLogInInput} />
            <br /><br />
            <label htmlFor="password">Password:</label>
            <br />
            <input name="password" id="password" type="password" placeholder='Password' value={this.state.password} onChange={this.handleLogInInput} />
            <br />
            <input type="submit" value="Submit" className="logButton" />
          </form>
        </div>
      )
    } else {
      return (<button className="logButton" onClick={this.logOut}>Log Out</button>)
    }
  }

  renderMessage = (e) => {
    return (
      this.state.message && <p>{this.state.message}</p>
    );
  }

  renderProjects = (e) => {
    if (localStorage.getItem("jwt")) {
      return (<ProjectsContainer />)
    }
  }

  renderSteps = (e) => {
    if (localStorage.getItem("jwt")) {
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
        {this.renderProjects()}
        <aside className="sidebar">
          {this.renderSteps()}
          {this.renderLogIn()}
          {this.renderMessage()}
          
        </aside>
      </div>
    );
  }
}

export default App;

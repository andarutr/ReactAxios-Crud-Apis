import React, { Component } from 'react';
import Navbar from './component/Navbar';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      members: [],
      first_name: "",
      last_name: "",
      buttonDisabled: false,
      formStatus: "create",
      memberIdSelected: null
    };
  }

  componentDidMount(){
    axios.get('https://reqres.in/api/users?page=2')
    .then(response => {
      this.setState({ members: response.data.data });
    })
    .catch(error => {
      console.log(error);
    });
  }

  inputOnChangeHandler = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmitHandler = event => {
    console.log('form telah disubmit');
    event.preventDefault();
    this.setState({buttonDisabled: true});
    let payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name
    }
    let url = '';
    if(this.state.formStatus === "create")
    {
      url = 'https://reqres.in/api/users';
      this.addMember(url, payload);
    }else{
      url = 'https://reqres.in/api/users/${this.state.memberIdSelected}';
      this.editMember(url, payload);
    }
  }

  addMember = (url, payload) => {
    axios.post(url, payload)
    .then(response => {
      console.log(response);
      let members = [...this.state.members];
      members.push(response.data);
      this.setState({members, buttonDisabled: false, first_name: "", last_name: ""});
    })
    .catch(error => {
      console.log(error);
    });
  }

  editMember = (url, payload) => {
    axios.put(url, payload)
      .then(response => {
        let members = [...this.state.members];
        let indexmember = members.findIndex(
          member => member.id === this.state.memberIdSelected
        );
        members[indexmember].first_name = response.data.first_name;
        members[indexmember].last_name = response.data.last_name;
        
        this.setState({
          members,
          buttonDisabled: false,
          first_name: "",
          last_name: "",
          formStatus: "create",
        });
      }).catch(error => {
        console.log(error);
      });
  }

  editButtonHandler = (member) => {
    this.setState({
      first_name: member.first_name,
      last_name: member.last_name,
      formStatus: "edit",
      memberIdSelected: member.id
    });
  }

  deleteButtonHandler = id => {
    let url = 'https://reqres.in/api/users/${id}';
    axios.delete(url)
      .then(response => {
        if(response.status === 204){
          let members = [...this.state.members];
          let index = members.findIndex(member => member.id === id);
          members.splice(index, 1);
          this.setState({members});
        }
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div className="container mt-5">
          <h1>Latihan AXIOS</h1>
          <div className="row">
            <div className="col-md-6" style={{ border: "1px solid black" }}>
              <h2>Member</h2>
              <div className="row">
              {this.state.members.map((member, index) => 
                <div className="col-md-6" key={member.id}>
                  <div className="card" style={{ margin: 10 }}>
                      <div className="card-body">
                          <h5 className="card-title">{member.id}</h5>
                          <h5 className="card-title">{member.first_name}</h5>
                          <h5 className="card-title">{member.last_name}</h5>
                          <button className="btn btn-primary" onClick={() => this.editButtonHandler(member)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => this.deleteButtonHandler(member.id)}>Delete</button>
                      </div>
                  </div>
                </div>
              )}
              </div>
            </div>
            <div className="col-md-6" style={{ border: "1px solid black" }}>
              <h2>Form {this.state.formStatus}</h2>
              <form onSubmit={this.onSubmitHandler}>
                <div className="form-group">
                <label>First Name</label>
                <input 
                    type="text" 
                    className="form-control"
                    name="first_name"
                    value={this.state.first_name}   
                    onChange={this.inputOnChangeHandler}             
                />
                </div>
                <div className="form-group">
                <label>Last Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    name="last_name"
                    value={this.state.last_name}  
                    onChange={this.inputOnChangeHandler} 
                />
                </div>
                <button type="submit" className="btn btn-primary" disabled={this.state.buttonDisabled}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

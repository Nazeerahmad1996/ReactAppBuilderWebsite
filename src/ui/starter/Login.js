import React, { Component } from 'react'
import Config from   './../../config/app';

/**
 * 
 *  How to setup your login page
 * 
 *  Form element
 *  <form onSubmit={this.handleSubmit}>
 * 
 *  Email
 *  <input type="email" value={this.state.username} onChange={this.handleChangeUsername} className="form-control" />
 * 
 *  Password
 *  <input type="password" value={this.state.password} onChange={this.handleChangePassword} className="form-control" />
 * 
 *  Error access
 *  <h4>{this.props.error}</h4>
 * 
 *  Google login
 *  {this.props.showGoogleLogin()}
 * 
 *  sendPasswordResetLink
 *  {this.props.sendPasswordResetLink()}
 */

export default class LoginUI extends Component {

    constructor(props) {

        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }
    
    handleChangePassword(event) {
       this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        this.props.authenticate(this.state.username,this.state.password);
        event.preventDefault();
       
      }

    render() {
        return (
            <div>Your login page here</div>
        )
    }
}

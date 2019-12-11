/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from '../config/database'
import Config from   './../config/app'
import Card from './../ui/template/Card'
import Image from './../components/fields/Image'
import Input from './../components/fields/Input'

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class User extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      user: {},
      password: "",
      confirmPass: ""
    }

    this.setupUserProfile = this.setupUserProfile.bind(this);
    this.authListener = this.authListener.bind(this);
    this.setUpName = this.setUpName.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentDidMount(){
    this.authListener();
  }
  
  authListener(){
    const setUser=(user)=>{
    this.setState({user:user})
    }

    //Now do the listner
    firebase.app.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUser(user);
        // User is signed in.
        console.log("User has Logged  in Master");
        console.log(user.email);
        
    } else {
        // No user is signed in.
        console.log("User has logged out Master");
    }
    });
  }

  //Setup user display name
  setUpName(displayName){
    console.log("got --- "+displayName)
    var user=firebase.app.auth().currentUser;

    this.setState({ user:user });
    user.updateProfile({
      displayName: displayName
    }).then(function() {
      console.log("Updated"),
      firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).update({
        displayName: displayName
      })   
    }).catch(function(error) {
      console.log("error "+error.message)
    });
  }

  //Setup user image
  setUpUserImage(linkToImage){
    firebase.app.auth().currentUser.updateProfile({
      photoURL: linkToImage
    }),
    firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).update({
      userImage: linkToImage
    })
  }
  
  //Reset password 
  resetPassword(){
    if(this.state.password.length > 4){
      if(this.state.password === this.state.confirmPass){
        firebase.app.auth().currentUser.updatePassword(this.state.password).then(function() {
          alert("Your password has been sucesfully updated");
        }).catch(function(error) {
          alert(error.message)
        });
      }else{
        alert("Password fields doesn't match")
      }
    }else{
      alert("Please fill out password fields. Minimum required in 5 characters")
    }
  }

  //Setup view for user profile
  setupUserProfile(){
    var userPhoto=this.state.user.photoURL?this.state.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512";
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
            <div className="row">
              <Card 
                class="col-md-3 col-md-offset-2"
                name={"userDataRight"}
                title={"User Info"}
                showAction={false}
                >
                <row>
                  <br /><br />
                  <div className="col-md-12">
                    <div className="col-md-6 col-md-offset-3">
                      <Image 
                        class="img-circle"
                        wrapperClass=" "
                        theKey="image"
                        value={userPhoto}
                        updateAction={(imageName,linkToImage)=>{this.setUpUserImage(linkToImage)}}
                        >
                      </Image>
                    </div>
                    <div className="clearfix"></div>
                    <div className="col-md-8 col-md-offset-2">
                      <h4 className="text-center">{this.state.user.displayName}</h4>
                      <p className="text-center"><b>{this.state.user.email}</b></p>
                    </div>
                  </div>
                </row>
              </Card>
              <div className="col-md-7">
                <div className="row">
                <Card 
                  class="col-md-12"
                  name={"userDataRight"}
                  title={"My Profile"}
                  showAction={false}
                  >
                  <div className="row">
                    <div className="form-group-md col-md-10 col-md-offset-1">
                      <div className="row">
                        <label for="firstName" className="col-md-3 col-form-label labelUserProfile">Full Name</label>
                        <div className="col-md-7">
                          <ConditionalDisplay condition={this.state.user.email}>
                            <Input 
                              class="col-md-7"
                              theKey="name"
                              
                              value={this.state.user.displayName}
                              updateAction={(nameKey,displayName)=>{this.setUpName(displayName)}}
                              >
                              </Input>
                            </ConditionalDisplay>
                          </div>
                        </div>
                        <br /><br />
                      </div>
                    </div>
                  </Card>
                  <Card 
                  class="col-md-12"
                  name={"userPassword"}
                  title={"Reset Password"}
                  showAction={false}
                  >
                  <div className="row">
                    <div className="form-group-md col-md-10 col-md-offset-1">
                      <div className="row">
                        <label for="password" className="col-md-3 col-form-label labelUserProfile">New Password</label>
                          <div className="col-md-7">
                            <Input 
                              class="col-md-7"
                              theKey="password"
                              value={this.state.password}
                              type={"password"}
                              updateAction={(nameKey,newpassword)=>{
                                this.setState({
                                  password: newpassword
                                })
                              }}
                              >
                              </Input>
                          </div>
                        </div>
                      </div>
                      <div className="form-group-md col-md-10 col-md-offset-1">
                        <div className="row">
                          <label for="passwordConfirmation" className="col-md-3 col-form-label labelUserProfile">New Password Confirmation</label>
                          <div className="col-md-7">
                            <Input 
                              class="col-md-7"
                              theKey="passwordConfirm"
                              value={this.state.confirmPass}
                              type={"password"}
                              updateAction={(nameKey,newpassword)=>{
                                this.setState({
                                  confirmPass: newpassword
                                  })
                              }}
                              >
                              </Input>
                            </div>
                        </div>
                        <br /><br />
                        <a type="submit" onClick={this.resetPassword} className={"btn "+Config.designSettings.submitButtonClass}>Change password</a>
                        </div>
                    </div>
                  </Card>
                  <div style={{"text-align": "center"}} className="col-md-8 col-md-offset-7">
                    <br />
                    <br />
                    <a className="button" href="/">Go Back</a>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div> 
    )
  }

render() {
    return (
      this.setupUserProfile()
    )
  }
}

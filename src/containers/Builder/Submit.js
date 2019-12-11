/*eslint no-useless-escape: "off"*/
import React, { Component } from 'react'
import Wizzard from "./../../ui/template/Wizzard";
import NavBar from './../../ui/template/NavBar'
import Input from './../../components/fields/Input'
import firebase from '../../config/database'
import Config from   '../../config/app';

export default class Submit extends Component {

    constructor(props){
        super(props);
        this.state={
            app:null,
            appleUsername: "",
            applePassword: ""
        }
        this.submitApp = this.submitApp.bind(this);
        this.getAppleUserName = this.getAppleUserName.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }


    componentDidMount(){
        var _this=this;
        var wholeApp = firebase.app.database().ref(Config.appEditPath);
        wholeApp.on('value', function(snapshot) {
            _this.setState({
              app:snapshot.val(),
            })
 
            _this.getAppleUserName(snapshot.val().rabid)
          });
    }

    //Get Apple username when user has already submit the app
    getAppleUserName(rabid){
        var _this=this;
        if(rabid){
            firebase.app.database().ref("rab_pointers/apps_queue/"+rabid+"_ios").on('value',function(snapshot) {
                if(snapshot.val()){
                    _this.setState({
                        appleUsername:snapshot.val().appleUsername
                    })
                }
            });
        }
    }

    //Email validation
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var testCase = re.test(String(email).toLowerCase());

        if(testCase)
            return true;
        else return false;           
    }

    //Submit the app and set to firebase 
    submitApp(){
        if(this.state.appleUsername && this.state.applePassword){
            if(this.validateEmail(this.state.appleUsername)){
                firebase.app.database().ref(Config.appEditPath+"/appIsSubmited").set(true);
        
                var user=firebase.app.auth().currentUser;
                var objectToSet={
                    appId:this.state.app.rabid,
                    userDisplayName:user.displayName,
                    userEmail:user.email,
                }
                firebase.app.database().ref("rab_pointers/apps_queue/"+this.state.app.rabid+"_android").set(objectToSet);
        
                objectToSet.appleUsername=this.state.appleUsername;
                objectToSet.applePassword=this.state.applePassword;
        
                firebase.app.database().ref("rab_pointers/apps_queue/"+this.state.app.rabid+"_ios").set(objectToSet);
                //alert("Submit app "+this.state.app.id)
            }else{
                alert("Please write valid Apple username")
            }
            
        }else{
            alert("Please fill all required inputs")
        }
    }

    //Show apple informations form
    showSubmitContent(){
        return (
            <div className="col-md-12">
                <br />
                <h3>Apple Informations</h3>
                <hr />
                <div className="row">
                    <div className="col-md-8 col-md-offset-3">
                        <div className="row">
                            <label for="username" className="col-md-3 col-form-label labelUserProfile">Username</label>
                            <div className="col-md-5">
                                <Input 
                                class="col-md-5"
                                theKey="username"
                                value={this.state.appleUsername}
                                updateAction={(nameKey,appleUsername)=>{
                                    this.setState({
                                        appleUsername: appleUsername
                                    })
                                }} 
                                >
                                </Input>
                            </div>
                        </div>
                        <div className="row">
                            <label for="password" className="col-md-3 col-form-label labelUserProfile">Password</label>
                            <div className="col-md-5">
                                <Input 
                                class="col-md-5"
                                theKey="password"
                                value={this.state.applePassword}
                                type={"password"}
                                updateAction={(nameKey,applePassword)=>{
                                    this.setState({
                                    applePassword: applePassword
                                    })
                                }}
                                >
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-md-1">
                        </div>
                    <div className="col-md-1">
                        <i className="material-icons">warning</i>
                    </div>
                    <div className="col-md-9">
                        <p>Your Apple Password is encrypted when saved in our Database.<br />
                        Soon as we create your app, we remove the encrypted password from our database!<br />
                        You can hange your pass when we publish your ios app!</p>
                    </div>
                </div>
                <br />
                <hr />
                <a onClick={this.submitApp} className={"btn "+Config.designSettings.submitButtonClass}>Submit app</a>
            </div>
        );
    }

    getSubmitContent(){
        if(this.state.app!=null&&this.state.app.id){
            //1. Doens' have status show the submit button
            if(!this.state.app.appIsSubmited){
                return this.showSubmitContent();
            }else{
                //Appis submited
                return (<div><h3>App is submited!</h3><p>There is no need for additional submision since we have Real Time Updates to the app content. <br />If you wnat to change App name, Icon, logo or splash, do that and come back here.</p></div>)
            }
            //2. has submite status , show already send
        }else{
            return (<div>...</div>)
        }
    }


    render() {
        return (
            <div className="main-panel">
            <NavBar></NavBar>
            <Wizzard 
            title={"App submit"}
            steps={[{
                name:"submit",
                icon:"check_circle_outline",
                title:"Submit your app",
                active:"active",
                label1:"Our automated script",
                label2:"will send you an email when your apps are made",
                content:this.getSubmitContent()
            }]}
            />
    </div>
        )
    }
}

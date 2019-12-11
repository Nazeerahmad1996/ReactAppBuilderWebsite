/*eslint array-callback-return: "off"*/
import React, { Component } from 'react'
import firebase from './../../config/database'
import Config from   './../../config/app'
import { Link } from 'react-router'

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
export default class NavBarDefault extends Component {

    constructor(props){
        super(props);

        this.state = {
            user: {}
        }

        this.createUserView = this.createUserView.bind(this);
        this.checkIsSuperAdmin = this.checkIsSuperAdmin.bind(this);
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

    createUserView(){
        if(this.props.user){
            var userPhoto=this.props.user.photoURL?this.props.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.props.user.email+"")+"?s=512";
        }
       
        return (
            <li className="dropdown userDropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img alt="" className="img-circle img-responsive fireadmin-user_image" src={userPhoto} /></a>
                 {this.checkIsSuperAdmin()}
            </li>
        );
    }

    checkIsSuperAdmin(){
        var isSuperAdmin = false;
        if(Config.adminConfig.adminUsers){
            Config.adminConfig.adminUsers.map((user)=>{
                if(firebase.app.auth().currentUser.email === user){
                    isSuperAdmin = true;
                }
            })
        }
       if(isSuperAdmin)
            return (
                <ul className="dropdown-menu" role="menu">
                    <li><Link to="/account">Account</Link></li>
                    <ConditionalDisplay condition={Config.isSaaS}>
                        <li><Link to="/billing">Billing</Link></li>
                    </ConditionalDisplay>
                    <li><Link to="settings/rab_saas_site">Settings</Link></li>
                    <li><Link to="users/users">Users</Link></li>
                    <li className="divider" />
                    <li role="button"><a onClick={this.handleLogout}>Logout</a></li>
                </ul>
            )
            else return (
                <ul className="dropdown-menu" role="menu">
                    <li><Link to="/account">Account</Link></li>
                    <ConditionalDisplay condition={Config.isSaaS}>
                        <li><Link to="/billing">Billing</Link></li>
                    </ConditionalDisplay>
                    <li className="divider" />
                    <li role="button"><a onClick={this.handleLogout}>Logout</a></li>
                </ul>
            )
    }

    handleLogout(e) {
        e.preventDefault();
    
        console.log('The link was clicked.');
        firebase.app.auth().signOut();
    }

    getFirstName(userDisplayName){
        if(userDisplayName){
            var splitUserName = userDisplayName.split(" ");
            return (<span style={{ color: '#e91e63'}}>{splitUserName[0]}</span>);
        }
    }

    render() {
        return (
            <nav className="navbar navbar-transparent navbar-absolute">
                <div className="container-fluid">
                    <div className="navbar-minimize">
                    </div>
                    <div className="navbar-header" style={{ 'padding-top': '13px'}}>
                        <button type="button" className="navbar-toggle" data-toggle="collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" href="#"><h7><b>Dashboard</b></h7></a>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <ConditionalDisplay condition={this.state.user.displayName}>
                                <li style={{ 'padding-top': '10px'}}><Link to="/account" style={{ 'padding-left': '73px', 'padding-right':'2px'}}>Hello, {this.getFirstName(this.state.user.displayName)}</Link></li>
                            </ConditionalDisplay>
                            {this.createUserView()}
                            <li className="separator hidden-lg hidden-md" />
                        </ul>
                        {this.props.search?<form className="navbar-form navbar-right" role="search" style={{ 'padding-top': '13px'}}>
                            <div className="form-group form-search is-empty">
                                <input type="text" onChange={this.props.onChange} className="search-query form-control" value={this.props.filter} placeholder="Search apps" />
                            <span className="material-input" />
                            </div>
                        </form>:<div></div>}
                        
                    </div>
                </div>
            </nav>

            /*<nav className="navbar navCustom">
                <div className="container-fluid col-md-10 col-md-offset-1">
                    <div className="col-md-3">
                        <div className="navbar-header navHeaderCustom">
                            <a className="navbar-brand" href="#">{this.props.title}</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        {this.props.search?<div id="custom-search-input">
                            <div className="input-group col-md-12">
                                <input type="text" onChange={this.props.onChange} className="search-query form-control searchInput" value={this.props.filter} placeholder="Search apps" />
                            </div>
                        </div>:<div></div>}
                    </div>
                    <div className="col-md-3">
                        <div className="collapse navbar-collapse" id="bs-slide-dropdown">
                            <ul className="nav navbar-nav navbar-right">
                                {this.props.userDropdown()}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>*/

        )
  }
}

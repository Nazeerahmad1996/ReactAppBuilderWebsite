import React, { Component } from 'react';

import Master from './containers/Master'
import App from './containers/App'
import Fireadmin from './containers/Fireadmin'
import Firestoreadmin from './containers/Firestoreadmin'
import Push from './containers/Push'
import Config from   './config/app'
import User from './containers/User'
import HomeMaster from './containers/HomeMaster'

//Builder
import Sections from './containers/Builder/Sections'
import Producer from './containers/Builder/Producer'
import SubmitScreen from './containers/Builder/Submit'
import Apps from './containers/Builder/Apps'
import Create from './containers/Builder/Create'
import Preview from './containers/Builder/Preview'
import Billing from './containers/Builder/Billing'

import { Router, Route,hashHistory} from 'react-router'

/*const Settings = ({  loadPath }) => (
  <Fireadmin loadPath={loadPath} />
  );*/
class Admin extends Component {

  //Prints the dynamic routes that we need for menu of type fireadmin
  getFireAdminRoutes(item){
    if(item.link==="fireadmin"){
      return (<Route path={"/fireadmin/"+item.path} component={Fireadmin}/>)
    }else{

    }
  }

  //Prints the dynamic routes that we need for menu of type fireadmin
  getFireAdminSubRoutes(item){
    if(item.link==="fireadmin"){
      return (<Route path={"/fireadmin/"+item.path+"/:sub"} component={Fireadmin}/>)
    }else{

    }
  }

  //Prints the Routes
  /*
  {Config.adminConfig.menu.map(this.getFireAdminRoutes)}
  {Config.adminConfig.menu.map(this.getFireAdminSubRoutes)}
  */
  render() {
    return (
      <Router history={hashHistory}>
          <Route path={Config.isAppCreator?"/":"/applist"} component={Apps}></Route>
          
          <Route component={HomeMaster} >
            {/* make them children of `Home Master` */}
            <Route path="/create" component={Create}></Route>
            <Route path="/account" component={User}></Route>
            <Route path="/billing" component={Billing}></Route>

            <Route path="/settings" loadedPath="/settings/" hideHamburger={true} resetEditPath={true} component={Fireadmin}/>
            <Route path="/settings/:sub" loadedPath="/settings/" hideHamburger={true} resetEditPath={true} component={Fireadmin}/> 

            <Route path="/users" loadedPath="/users/" tableHeaders={["email","numOfApps","userImage"]} resetEditPath={true} hideHamburger={true} component={Fireadmin}/>
            <Route path="/users/:sub" loadedPath="/users/" tableHeaders={["email","numOfApps","userImage"]} resetEditPath={true} hideHamburger={true} component={Fireadmin}/>
          </Route>

          <Route component={Master} >
            {/* make them children of `Master` */}
            <Route path={Config.isAppCreator?"/dashboard":"/"} component={App}></Route>
            <Route path="/sections/:sub" key="section" component={Sections}/>
            <Route path="/produce/:sub" key="produce" component={Producer}/>
            <Route path="/submit/:sub" key="submit" component={SubmitScreen}/>
            <Route path="/preview/:sub" key="preview" component={Preview}/>
            <Route path="/app" component={App}/>
            <Route path="/push" component={Push}/>

            <Route path="/fireadmin" loadedPath="/fireadmin/" hideHamburger={false} component={Fireadmin}/>
            <Route path="/fireadmin/:sub" loadedPath="/fireadmin/" hideHamburger={false} component={Fireadmin}/>

            <Route path="/firestoreadmin" component={Firestoreadmin}/>
            <Route path="/firestoreadmin/:sub" component={Firestoreadmin}/>
          </Route>
        </Router>
    );

   } 
  }


export default Admin;

/*eslint no-unused-vars: "off"*/
import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './Admin';
import Login from './Login';
import Splash from './Splash';
import Config from   './config/app';
import design from   './ui/template/Config';
import * as FirebaseSDK from 'firebase';
require("firebase/firestore");

//console.log = function() {}
import firebase from './config/database'

//Remove data fethced
var configReceived=!Config.remoteSetup;

if(Config.remoteSetup){
  //Do a remote setuo of the admin
  var connectionPath=Config.remotePath;
  if(Config.allowSubDomainControl){
    //Control by subdomain
    connectionPath=Config.subDomainControlHolder+window.THE_DOMAIN;
  }
  var fetcherFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"fetcher");
  fetcherFirebaseApp.database().ref(connectionPath).once('value').then(function(snapshot) {
    console.log(snapshot.val())
    Config.firebaseConfig=snapshot.val().firebaseConfig;
    Config.adminConfig=snapshot.val().adminConfig;
    Config.navigation=snapshot.val().navigation;
    Config.pushSettings=snapshot.val().pushSettings;
    firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
    configReceived=true;
    checkLoginStatus();
    displayApp();
  });
}else{
  // Legacy, local setup
  firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
  checkLoginStatus();
  displayApp();
}




//AUTHENTICATION
var loggedIn=false;

function checkLoginStatus(){
  
  if(Config.firebaseConfig.apiKey){
    firebase.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("User is signed in "+user.email);

        if(Config.adminConfig.allowedUsers!=null&&Config.adminConfig.allowedUsers.indexOf(user.email)===-1){
          //Error, this user is not allowed anyway
          alert("The user "+user.email+" doens't have access to this admin panel!");
          firebase.app.auth().signOut();
        }else{
          loggedIn=true;

          //Update Paths
         for (let index = 0; index < Config.navigation.length; index++) {
          Config.navigation[index].path=Config.navigation[index].path.replace("{useruuid}",user.uid); 
          if( Config.navigation[index].subMenus){
            for (let subIndex = 0; subIndex < Config.navigation[index].subMenus.length; subIndex++) {
              Config.navigation[index].subMenus[subIndex].path=Config.navigation[index].subMenus[subIndex].path.replace("{useruuid}",user.uid); 
            }
          }
         }
          

         //Do we have our pushSettings remoutly configurable
         if(Config.pushSettings.remoteSetup){
          var fetcherPushConfigFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"pushFetcher");
          fetcherPushConfigFirebaseApp.database().ref(Config.pushSettings.remotePath).once('value').then(function(snapshot) {
            //alert("FETCH PUSH CONFIG")
            //alert(snapshot.val())
            Config.pushSettings=snapshot.val();
            displayApp();
          });
         }else{
          displayApp();
         }
          
        }



      } else {
        // No user is signed in.
        console.log("No user is signed in ");
        loggedIn=false;
        displayApp();
        if(window.display){
            window.display();
        }

      }
  })
  }else{
    // No user is signed in.
      console.log("No user is signed in, step 1 ");
      loggedIn=false;
      displayApp();
      if(window.display){
          window.display();
      }
  }
}



function displayApp(){
  if(!configReceived){
     ReactDOM.render(
        <Splash />,
        document.getElementById('root')
      );
  }else{
    //Show splash window
    if(loggedIn){

      
      ReactDOM.render(
        <Admin />,
        document.getElementById('root')
      );
    }else{
      ReactDOM.render(
        <Login />,
        document.getElementById('root')
      );
    }
  }
  
}
displayApp();

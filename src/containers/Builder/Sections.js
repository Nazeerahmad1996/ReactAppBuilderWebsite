/*eslint eqeqeq: "off"*/
/*eslint no-unused-vars: "off"*/
/*eslint no-useless-escape: "off"*/


import React, {Component} from 'react'
import {Link} from 'react-router'
import NavBar from './../../ui/template/NavBar'
import SortableTree,{removeNodeAtPath} from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import firebase, { app } from '../../config/database'
import Config from   '../../config/app';
import SectionConfig from '../../config/builder/sections_config';
import {Image} from '../../components/fields'
import Notification from '../../components/Notification';
import SkyLight from 'react-skylight';
import Wizzard from "./../../ui/template/Wizzard";


const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
const getNodeKey=({ node }) => node.tree_path;

class Sections extends Component {
  constructor(props){
    super(props);

    this.state = {
      treeData: [],
      showAddButton:false,
      components:null,
      name:"",
      id:"",
      appImage:"",
      app:{
        appImage:""
      },
      pathToDelete:"",
      nodeToDelete:{name:""},
      md:SectionConfig.md,
      sv:SectionConfig.sv
    };

    this.processDataForShowing=this.processDataForShowing.bind(this);
    this.processDataForSaving=this.processDataForSaving.bind(this);
    this.appendSection=this.appendSection.bind(this);
    this.saveAppInfo=this.saveAppInfo.bind(this);
    this.cancelDelete=this.cancelDelete.bind(this);
    this.doDelete=this.doDelete.bind(this);
    this.appKey="";
  }


  componentDidMount(){

    /*if(this.props.params&&this.props.params.sub){
      this.appKey=this.props.params.sub;
    }*/

    //console.log("<---------->"+Config.appEditPath+"<------------>");
    var menus = firebase.app.database().ref(Config.appEditPath+'/navigation/menus');
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    var components = firebase.app.database().ref('/components/navigation/menus');

    var _this=this;
    menus.on('value', function(snapshot) {
        console.log(snapshot.val());
        _this.processDataForShowing(snapshot.val()) 
    });

    wholeApp.once('value', function(snapshot) {
      console.log(snapshot.val());

      _this.setState({
        app:snapshot.val(),
        name:snapshot.val().name,
        id:snapshot.val().id,
        appImage:snapshot.val().appImage,
      })

      _this.checkRabId(snapshot.val())
    });

    components.on('value', function(snapshot) {
      console.log(snapshot.val());
      _this.setState({components:snapshot.val()}) 
  });
  
   }

   generateNotifications(item){
    return (
        <div className="col-md-12">
            <Notification type={item.type} >{item.content}</Notification>
        </div>
    )
}

checkRabId(app){
  // Find rab id
  var _this = this;
  // If there is rab id set in state
  if(app.rabid){
    _this.setState({
      rabId: app.rabid
    })
  }else{
    // else generate rab id and set in state
    var rab_pointers_ai = firebase.app.database().ref('/rab_pointers/ai/nextValue');
    rab_pointers_ai.transaction(function(ai) {
      if (ai) {
          ai++;
      }else{
          ai=1;
      }
      return ai;
    },function(e,done,ai){
      firebase.app.database().ref(Config.appEditPath).update({
        rabid: ai.val()
      });
      _this.setState({
        rabId: ai.val()
      })
    });
    
  }
}

doDelete(){
  console.log("Do delete ");
  console.log("Item to delete: "+this.state.pathToDelete);
  var data=this.state.treeData;
  var path=this.state.pathToDelete;
  

  //data= [{ tree_path: 0 },{ tree_path: 1 }];

  console.log(data);
  console.log(path);

   var nodes=removeNodeAtPath({
      treeData:data,
      path: path,
      getNodeKey: ({ node }) => node.tree_path,
  })

  this.setState({
    treeData:nodes
  })

  this.processDataForSaving(nodes);
  this.refs.deleteDialog.hide()
}


cancelDelete(){
  console.log("Cancel Delete");
  this.refs.deleteDialog.hide()
}


   appendSection(sectionName,icon){
    if(this.state.components!=null){
      var selectedSection=null;
      for (let index = 0; index < this.state.components.length; index++) {
        const element = this.state.components[index];
        if(element.name.toLowerCase()==sectionName.toLowerCase()){
          selectedSection=element;
        }
      }

      if(selectedSection!=null){
        //alert(selectedSection);
        var treeData=this.state.treeData;

        var lastIndex=Config.appEditPath.lastIndexOf("/");
        lastIndex++;
        var slug=Config.appEditPath.substring(lastIndex);
        


          //Convert to json 
          var jsRepr=JSON.stringify(selectedSection);
          //console.log(jsRepr);
          var find = 'data_point\":\"';
          var re = new RegExp(find, 'g');
          jsRepr = jsRepr.replace(re, 'data_point\":\"'+slug+'_');
          selectedSection=JSON.parse(jsRepr);
         // console.log(jsRepr);


        treeData.push(selectedSection);
        //console.log(treeData);
        this.saveNewMenuStructure(treeData);
        window.getReactInterfaceToJS().showNotification('bottom','right','success',"The new component <b>"+sectionName+"</b> has been added. Check it in the sections panel.",icon);
      }else{
        window.getReactInterfaceToJS().showNotification('bottom','right','warning',"We couldn't find the required component <b>"+sectionName+"</b>. Make sure you have updated the demo data in firebase.",icon);
      }
    }else{
      window.getReactInterfaceToJS().showNotification('bottom','right','danger',"Components not fetched. Pls check install manual.",icon);
    }
   }

   saveNewMenuStructure(menus){
    firebase.app.database().ref(Config.appEditPath+'/navigation/menus').set(menus);
   }

   saveAppInfo(key,value){
     var update={};
     update[key]=value;
    this.setState(update);
    firebase.app.database().ref(Config.appEditPath+'/'+key).set(value);
    firebase.app.database().ref(Config.appEditPath+'/appIsSubmited').set(null);
   }

   processDataForShowing(data){
    //console.log(JSON.stringify(data));
    for (let index = 0; index < data.length; index++) {
      data[index].title= data[index].name;
      data[index].expanded=true;
      data[index].tree_path=index;
      if(data[index].subMenus){
        data[index].children= data[index].subMenus;

        for (let j = 0; j < data[index].children.length; j++) {
          data[index].children[j].title= data[index].children[j].name;
          data[index].children[j].tree_path= index+Config.adminConfig.urlSeparator+"subMenus"+Config.adminConfig.urlSeparator+j;
        }


      }
    }

    this.setState({ treeData:data })
    //console.log(JSON.stringify(data));
   }

   processDataForSaving(treeData){
    var data=JSON.parse(JSON.stringify(treeData));
    this.setState({ treeData })

    for (let index = 0; index < data.length; index++) {
      delete data[index].title;
      delete data[index].expanded;
      delete data[index].tree_path;

      if(data[index].children){
        data[index].subMenus= data[index].children;

        delete data[index].children;
        for (let j = 0; j < data[index].subMenus.length; j++) {
          delete data[index].subMenus[j].title;
          delete data[index].subMenus[j].expanded;
          delete data[index].subMenus[j].tree_path;
        }


      }
    }
    this.saveNewMenuStructure(data);
    
   }

   createButton(item,theClass){
    return <button onClick={()=>{
      this.appendSection(item.componentName,item.icon);
    }} className={"btn "+theClass}><i className="material-icons">{item.icon}</i>{item.name}</button>
   } 

   generateIndex(index){
     var expandedCount=0;
     this.state.treeData.forEach(element => {
       if(element.expanded&&element.subMenus&&element.subMenus.length>0){
        expandedCount++;
       }
     });
    return expandedCount;
   }

   formIt(path){
    if((path+"").indexOf(',') == -1){
      return path;
    }else{
      return (path+"").substring((path+"").indexOf(',')+1);
    }
   }



   refreshDataAndHideNotification(time=3000){
    //Hide notifications
    setTimeout(function(){this.setState({notifications:[]})}.bind(this), time);
  }

  sectionTabContent(){
    return (<div style={{ height: 400 }}>
      
      <SortableTree
          ref="sortableTree"
          maxDepth={2}
          treeData={this.state.treeData}
          onChange={treeData => this.processDataForSaving(treeData)}
          getNodeKey={getNodeKey}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <Link to={"/fireadmin/navigation+menus+"+this.formIt(path)}>
              <button className="btn-primary">
               <i className="material-icons">settings</i>
              </button></Link>,
              
              <ConditionalDisplay condition={node.categorySetup&&node.detailsSetup&&node.listingSetup} >
               <div>
                &nbsp;&nbsp;
                <Link to={"/firestoreadmin/"+(node.listingSetup&&node.listingSetup.data_point?node.listingSetup.data_point:"")}>
                  <button className="btn-primary">
                    <i className="material-icons">storage</i>
                  </button>
                </Link>
               </div>
              </ConditionalDisplay>,
              <ConditionalDisplay condition={node.categorySetup&&node.detailsSetup&&node.listingSetup} >
              <div>
                &nbsp;&nbsp;
                <Link to={"/firestoreadmin/"+(node.categorySetup&&node.categorySetup.data_point?node.categorySetup.data_point:"")}>
                 <button className="btn-primary">
                 <i className="material-icons">folder</i>
                 </button>
               </Link>
              </div>
             </ConditionalDisplay>,
             <div>
             &nbsp;&nbsp;
             <a onClick={()=>{
                     this.refs.deleteDialog.show();
                     this.setState({nodeToDelete:node,pathToDelete:path})
                    }} >
                 <button  className="btn-danger">
                <i className="material-icons">delete</i>
               </button></a>
               </div>,
            ],
          })}

          
        />
        </div>)
  }


  addNewSectionContent(){
    return (<div>
                    
      {/* <button onClick={()=>{this.setState({showAddButton:!this.state.showAddButton})}} className="btn btn-rose"><i className={!this.state.showAddButton?"fa fa-window-restore":"fa fa-minus"}></i> {!this.state.showAddButton?"Add Master detail":"Cancel adding Master detail"}</button> */ }
      <ConditionalDisplay condition={true} >
      <div>
          
          <hr />
          MASTER DETAILS VIEWS
          <br />
          {this.state.md.map((item)=>{
            return this.createButton(item,Config.designSettings.submitButtonClass);
          })}
          <hr />
          
        </div>
      </ConditionalDisplay>
      <div>
          
          <hr />
          SPECIFIC VIEWS
          <br />

            {this.state.sv.map((item)=>{
            return this.createButton(item,Config.designSettings.buttonSuccessClass);
          })}
      <hr />
          <br />
        </div>
    </div>)
  }

  

  basicInfoContent(){
    return (
      <div>
      <br />
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">border_color</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">App name</label>
            <input value={this.state.name} name="name" onChange={(event)=>{
              this.saveAppInfo("name",event.target.value);
             }} type="text" className="form-control" />
          </div>
        </div>                                   
        <br />
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">linear_scale</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">Package id
              <small> (ex com.mycompany.app )</small>
            </label>
            <input  value={this.state.id}  name="id" type="text"  onChange={(event)=>{ this.saveAppInfo("id",event.target.value); }} className="form-control" />
          </div>
        </div>
        <div className="input-group">
          <span className="input-group-addon">
            <i className="material-icons">developer_mode</i>
          </span>
          <div className="form-group label-floating">
            <label className="control-label">App id
              <small> ( rab_id )</small>
            </label>
            <input value={this.state.rabId} className="form-control" disabled/>
          </div>
        </div>
      </div>)
  }


  imagesContent(){
    return (<div>
      <br /><br /><hr /><label>App Icon  - 192 x 192</label>
      <br />
        <Image 
          parentKey="image" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appImage",value);
          }} 
          class="" 
          theKey="image"  
          value={this.state.app.appImage} />
      
      <br /><br /><hr /><label>Logo - around 400x400</label>
      <br />
        <Image 
          parentKey="appLogo" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appLogo",value);
          }} 
          class="" 
          theKey="appLogo"  
          value={this.state.app.appLogo} />

      <br /><br /><hr /><label>Navigation logo - around 400x120</label>
      <br />
        <Image 
          parentKey="appNavLogo" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appNavLogo",value);
          }} 
          class="" 
          theKey="appNavLogo"  
          value={this.state.app.appNavLogo} />

      <br /><br /><hr /><label>Splash Screen - 1242 x 2436 - 9patch is accepted</label>
      <br />
        <Image 
          parentKey="appSplash" 
          options={{}} 
          updateAction={(key,value)=>{
            this.saveAppInfo("appSplash",value);
          }} 
          class="" 
          theKey="appSplash"  
          value={this.state.app.appSplash} />
      
      
      </div>
    )

  }


  render(){
    var theSteps=[
      {
        name:"sections",
        icon:"subject",
        title:"Sections",
        active:"active",
        label1:"Drag n Drop them. Also you can nest them.",
        label2:"App sections",
        content:this.sectionTabContent()
      },
      {
        name:"sectionsadd",
        icon:"playlist_add",
        title:"Add section",
        active:"",
        label1:"Just add the section you like",
        label2:"Use Master / Detail or some specific one",
        content:this.addNewSectionContent()
      },
      {
        name:"images",
        icon:"collections",
        title:"Images",
        active:"",
        label1:"App images",
        label2:"Icon, Splash, Logo",
        content:this.imagesContent()
      },
      {
        name:"basics",
        icon:"work_outline",
        title:"Basic",
        active:"",
        label1:"App info",
        label2:"Name, Package id, App id",
        content:this.basicInfoContent()
      }

      
    ];

    return (<div>
      <div className="main-panel col-md-12">
        <NavBar></NavBar>

        <SkyLight hideOnOverlayClicked ref="deleteDialog" title="">
          <span><h3  className="center-block">Delete section</h3></span>
          <div className="col-md-12">
              <Notification type="danger" >All data at this location, incuding nested sections, will be deleted!</Notification>
          </div>
          <div className="col-md-12">
              Section name
          </div>
          <div className="col-md-12">
              <b>{this.state.nodeToDelete.name}</b>
          </div>

          <div className="col-sm-12" style={{marginTop:80}}>
            <div className="col-sm-6">
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.cancelDelete} className="btn btn-info center-block">Cancel</a>
            </div>
            <div className="col-sm-3 center-block">
              <a onClick={this.doDelete} className="btn btn-danger center-block">Delete</a>
            </div>

          </div>

        </SkyLight>

        <Wizzard 
        title={"App Setup"}
        steps={theSteps}
       />


        </div>
      </div>)

  }
}
export default Sections;

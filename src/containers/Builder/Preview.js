/*eslint no-unused-vars: "off"*/
import React, {Component} from 'react'
import NavBar from './../../ui/template/NavBar'
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import Config from   '../../config/app';
import Wizzard from "./../../ui/template/Wizzard";

class Preview extends Component {
  constructor(props){
    super(props);

    this.state = {
    };

  }


  getPreviewContent(){
    return (
      <div>
        <p>Scan the qr code with this <a href="http://bit.ly/uniexporeact" target="_blank">preview app</a></p>
        <br />
        <img alt="" className="img" style={{width:"250px",height:"250px"}} src={"https://api.qrserver.com/v1/create-qr-code/?size=350x350&data="+encodeURIComponent(Config.firebaseConfig.apiKey+";"+Config.firebaseConfig.projectId+";"+Config.appEditPath)} /> 
        <br /><br /><br />
      </div>
    )
  }


  render() {

   return (
    <div className="main-panel">
    <NavBar></NavBar>
    <Wizzard 
      title={"App Preview"}
      steps={[{
        name:"preview",
        icon:"cloud_download",
        title:"Preview your app",
        active:"active",
        label1:"Just scan the QR code",
        label2:"And preview your app",
        content:this.getPreviewContent()
      }]}
    />
    </div>
   )
  }
}
export default Preview;

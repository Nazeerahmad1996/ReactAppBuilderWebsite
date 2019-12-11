import React, { Component } from 'react'

/**
 * Creates a card
 * 
 * Available props
 * name
 * title
 * children
 * action
 * showAction
 * class ex. "col-md-12"
 * 
 */
export default class CardUI extends Component {
    actionView(){
            if(this.props.showAction){
                return (
                <a  onClick={()=>{this.props.action()}}>The link</a>)
            }else{
                return (<div></div>)
            }
    }

    render() {
        return (
            <div className={this.props.class?this.props.class:"col-md-12"} key={this.props.name}>
                <div className="card">
                  {this.actionView()}
                  {this.props.children}
                </div>
              </div>
        )
    }
}

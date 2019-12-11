import React, { Component } from 'react'

/**
 * 
 * Avaialbe props
 * 
 * icon
 * link or onClick
 * image
 * isIcon
 * subTitle
 * title
 * buttonTitle
 * 
 */
export default class Tile extends Component {

    createIcon(){
        return (
                <div className="icon icon-rose">
                    <i className="material-icons">{this.props.icon}</i>
                </div>
        )
    }

    createImage(){
        return (
            <div className="card-avatar" >
                <a href={this.props.link}>
                    <img alt=""  className="img" width="90px" src={this.props.image} />
                </a>
            </div>
        )

    }

    createImageOrIcon(){
        if(this.props.isIcon){
            return this.createIcon()
        }else{
            return this.createImage();
        }
    }

    createActionOrLink(){
        if(this.props.link){
            return ( <a href={this.props.link}  className="btn btn-outline-light">{this.props.buttonTitle}</a>)
        }else{
            return ( <button onClick={this.props.onClick} className="btn btn-outline-light">{this.props.buttonTitle}</button>)
        }
    }

    render() {
        return (
            <div className="col-xl-4">
            <div className="widget widget-23 bg-gradient-02 d-flex justify-content-center align-items-center">
              <div className="widget-body text-center">
                {this.createImageOrIcon()}
                <div className="title">{this.props.title}</div>
                <div className="number">{this.props.subTitle}</div>
                <div className="text-center mt-3 mb-3">
                {this.createActionOrLink()} 
                </div>
              </div>
            </div>
          </div>
          
        )
    }
}

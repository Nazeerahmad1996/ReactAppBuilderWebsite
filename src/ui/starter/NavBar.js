import React, { Component } from 'react'
import {Link} from 'react-router'

/**
 * Create the nav bar 
 * 
 * Available props
 * items
 * path
 * title
 */
export default class NavBarUI extends Component {

    /**
     * Used to make the breadcrumb
     * @param {Object} items 
     * @param {String} path 
     */
    generateBreadCrumb(items,path){
        if(items){
            return (<ul className="breadcrumb">
            {
                items.map((item,index)=>{
                if(index==0){
                    path+=item;
                }else{
                    path+="+"+item;
                }
                return (<li className="breadcrumb-item"><Link to={path}>{item}</Link></li>)
            })}
          </ul>)
        }else{
            return (<div></div>)
        }
    }
    
    render() {
        return (
            <div >
                <h2 className="page-header-title">{this.props.title}</h2>
                {this.generateBreadCrumb(this.props.items,this.props.path)}
            </div>
        )
    }
}

/*eslint no-unused-vars: "off"*/
/*eslint no-script-url: "off"*/
/*eslint no-unused-expressions: "off"*/
import React, { Component } from 'react'
import Config from   './../../config/app';
var pjson = require('../../../package.json');
import NavItem from '../../components/NavItem'
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

/**
 * 
 *  Avalilable props
 * 
 *  {String} userPhoto - the user image
 *  {Object} user  - the current logged in user in firebase
 *  {Function} logout - the logout function, no paramas
 *  {Function} printMenuItem - function for priting the menu. Param 1 menu items
 *  {Object} additionalStyle1
 *  {React} children - childrens to display
 *   
 */

export default class MasterUI extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        //this.printMenuItem=this.printMenuItem.bind(this);
    }

    render() {
        return (
            <div>
                {/* ADD YOUR Master here, you must wrap your childrens */}
                {this.props.children}
                 {/* END YOUR Master here */}
            </div>
        )
    }
}

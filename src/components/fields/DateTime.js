import React, {Component} from 'react'
import {default as DT} from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment from 'moment'
import Config from   '../../config/app';

class DateTime extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:moment(props.value,props.dateFormats.saveAs),
      dateFormats:props.dateFormats,
    };
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(event) {
   this.setState({value: event});

   //Convert to desired save format 
    var converted=moment(event).format(this.props.dateFormats.saveAs)
    this.props.updateAction(this.props.theKey,converted,false,"date");
  }

  render() {
    return (
            <div className={Config.designSettings.editElementDivClass}>
                <label className="control-label"></label>
                <DT onChange={this.handleChange} value={this.state.value} dateFormat={this.props.dateFormats.dateFormat} timeFormat={this.props.dateFormats.timeFormat}  locale={this.props.dateFormats.locale||"en"} />
            </div>
    )
  }
}
export default DateTime;

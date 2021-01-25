import React, {Component} from 'react';
import axios from 'axios';

export default class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            email:''
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                Job application portal made for an assignment of DASS course at IIIT-H (Spring-2021).
           </div>
        )
    }
}
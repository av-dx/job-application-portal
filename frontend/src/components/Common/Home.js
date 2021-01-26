import React, { Component } from 'react';
import axios from 'axios';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: ''
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h4>
                    Job application portal made for the first assignment of DASS course at IIIT-H (Spring-2021). <br/>
                    <br/><br/><br/><br/><br/>
                    Submitted by :-
                    <br/>
                    <strong>
                        [Aashwin Vaish] <br />
                        [2019114014] <br />
                    </strong>
                </h4>
            </div>
        )

    }
}
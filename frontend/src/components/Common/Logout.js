import React, {Component} from 'react';
import axios from 'axios';

export default class Logout extends Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        localStorage.clear();
        setTimeout(function () {window.location='/';}, 5000)
    }

    render() {
        return (
            <div>
                You have been logged out of this browser. You will be redirected to the home page in a few seconds.
           </div>
        )
    }
}
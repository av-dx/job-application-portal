import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

export default class NavBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/" className="navbar-brand">Demo</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </li>
                            <li className="navbar-item" hidden={!(localStorage.getItem("type") == "applicant")}>
                                <Link to="/applicant/applications" className="nav-link">My Applications</Link>
                            </li>
                            <li className="navbar-item" hidden={!(localStorage.getItem("type") == "recruiter")}>
                                <Link to="/recruiter/employees" className="nav-link">My Employees</Link>
                            </li>
                            <li className="navbar-item" hidden={(localStorage.getItem("name"))}>
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                            <li className="navbar-item" hidden={(localStorage.getItem("name"))}>
                                <Link to="/login" className="nav-link" >Login</Link>
                            </li>
                            <li className="navbar-item" hidden={!(localStorage.getItem("name"))}>
                                <Link to="/profile" className="nav-link">{localStorage.getItem("name")}</Link>
                            </li>
                            <li  className="navbar-item mr-sm-2" hidden={!(localStorage.getItem("name"))}>
                                <Link to="/logout" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}
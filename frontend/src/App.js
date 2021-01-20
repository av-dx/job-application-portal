import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/Users/UsersList'
import JobsList from './components/Users/JobsList'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Login from './components/Common/Login'
import Navbar from './components/templates/Navbar'
import ApplicantProfile from './components/Users/ApplicantProfile'
import EditApplicantProfile from './components/Users/EditApplicantProfile'
import RecruiterProfile from './components/Users/RecruiterProfile'
import EditRecruiterProfile from './components/Users/EditRecruiterProfile'

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/users" exact component={UsersList} />
        <Route path="/jobs" exact component={JobsList} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={(localStorage.getItem("type") == "recruiter") ? RecruiterProfile : ApplicantProfile} />
        <Route path="/editprofile" component={(localStorage.getItem("type") == "recruiter") ? EditRecruiterProfile : EditApplicantProfile} />
      </div>
    </Router>
  );
}

export default App;

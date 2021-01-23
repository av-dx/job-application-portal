import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/Users/UsersList'
import ApplicantDashboard from './components/Users/ApplicantDashboard'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Login from './components/Common/Login'
import Navbar from './components/templates/Navbar'
import ApplicantProfile from './components/Users/ApplicantProfile'
import EditApplicantProfile from './components/Users/EditApplicantProfile'
import RecruiterProfile from './components/Users/RecruiterProfile'
import EditRecruiterProfile from './components/Users/EditRecruiterProfile'
import RecruiterDashboard from './components/Users/RecruiterDashboard';
import NewJob from './components/Users/NewJob';
import NewApplication from './components/Users/NewApplication';
import RecruiterApplicationsDashboard from './components/Users/RecruiterApplicationsDashboard';

function App() {
  return (
    <Router>
      <div className="container px-0">
        <Navbar />
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/profile" exact component={(localStorage.getItem("type") == "recruiter") ? RecruiterProfile : ApplicantProfile} />
        <Route path="/profile/edit" exact component={(localStorage.getItem("type") == "recruiter") ? EditRecruiterProfile : EditApplicantProfile} />
        <Route path="/dashboard" component={(localStorage.getItem("type") == "recruiter") ? RecruiterDashboard : ApplicantDashboard} />
        <Route path="/job/create" exact component={NewJob} />
        <Route path="/job/applications" exact component={RecruiterApplicationsDashboard} />
        <Route path="/application/create" component={NewApplication} />
      </div>
    </Router>
  );
}

export default App;

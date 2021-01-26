import React, { Component } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Rating from '@material-ui/lab/Rating';


class RecruiterApplicationsDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            job: this.props.location.state.job,
            applications: [],
            nameSortedApplications: [],
            dateSortedApplications: [],
            ratingSortedApplications: [],
            sortBy: "none",
            sortAsc: true
        };
        this.sortedIcon = this.sortedIcon.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
        this.updateApplication = this.updateApplication.bind(this);
    }

    componentDidMount() {
        axios.post('http://localhost:4000/job/' + this.state.job._id + '/applications', {
            userid: localStorage.getItem("userid"),
            password: localStorage.getItem("password")
        })
            .then(response => {
                this.setState({
                    applications: response.data.array,
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    updateApplication(index, applicationid, newStatus) {
        axios.post('http://localhost:4000/application/' + applicationid + '/' + newStatus, {
            userid: localStorage.getItem("userid"),
            password: localStorage.getItem("password"),
            jobid: this.state.job._id,
        })
            .then(response => {
                var arr = [...this.state.applications];
                arr[index].status = newStatus + "ed";
                this.setState({
                    applications: arr,
                })
                alert(response.data.error);
            })
            .catch(function (error) {
                alert(error);
            })
    }

    sortByName() {
        var array = this.state.applications;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a._applicant.name != undefined && b._applicant.name != undefined) {
                return (1 - flag * 2) * (1 - 2 * (new String(a._applicant.name) < new String(b._applicant.name)));
            }
            else {
                return 1;
            }
        });
        this.setState({
            applications: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "name"
        })
    }
    sortByDate() {
        var array = this.state.applications;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.postedOn != undefined && b.postedOn != undefined) {
                return (1 - flag * 2) * (new Date(a.postedOn) - new Date(b.postedOn));
            }
            else {
                return 1;
            }
        });
        this.setState({
            applications: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "date"
        })
    }
    sortByRating() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.applications;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a._applicant.rating != undefined && b._applicant.rating != undefined) {
                return (1 - flag * 2) * (a._applicant - b._applicant.rating);
            }
            else {
                return 1;
            }
        });
        this.setState({
            applications: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "rating"
        })
    }

    sortedIcon(field) {
        if (field == this.state.sortBy) {
            if (this.state.sortAsc) {
                return (
                    <ArrowDownwardIcon />
                )
            }
            else {
                return (
                    <ArrowUpwardIcon />
                )
            }
        }
    }

    render() {
        return (
            <div>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"><Button onClick={this.sortByName}>Applicant Name {this.sortedIcon("name")} </Button></TableCell>
                                        <TableCell align="center">Skills</TableCell>
                                        <TableCell align="center"><Button onClick={this.sortByDate}>Date of applying{this.sortedIcon("date")}</Button></TableCell>
                                        <TableCell align="center">Education Info</TableCell>
                                        <TableCell align="center"> S.O.P.</TableCell>
                                        <TableCell align="center"><Button onClick={this.sortByRating}>Rating{this.sortedIcon("rating")}</Button></TableCell>
                                        <TableCell align="center">Stage</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.applications.map((application, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell align="center">{application._applicant.name}</TableCell>
                                            <TableCell align="center">{application._applicant.skills}</TableCell>
                                            <TableCell align="center">{new Date(application.postedOn).toLocaleDateString()}</TableCell>
                                            <TableCell align="center">
                                                <List dense>
                                                    {application._applicant.education.map((edu, i) => {
                                                        return (
                                                            <ListItem>
                                                                {i + 1}. {edu.institute} : ({edu.startYear} to {edu.endYear})
                                                            </ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </TableCell>
                                            <TableCell align="center">{application.sop}</TableCell>
                                            <TableCell align="center"><Rating value={application._applicant.rating} readOnly></Rating></TableCell>
                                            <TableCell align="center">{application.status}</TableCell>
                                            <TableCell align="center">
                                                {(application.status == "Submitted") ?
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={this.updateApplication.bind(this, ind, application._id, "Shortlist")}>
                                                        Shortlist
                                                    </Button>
                                                    :
                                                    (application.status == "Shortlisted") ?
                                                        <Button
                                                            color="primary"
                                                            variant="contained"
                                                            fullWidth
                                                            onClick={this.updateApplication.bind(this, ind, application._id, "Accept")}>
                                                            Accept
                                                    </Button>
                                                        :
                                                        (application.status == "Accepted") ?
                                                            <div></div>
                                                            :
                                                            <div>Invalid state</div>
                                                }
                                                {(application.status == "Accepted") ?
                                                    <div></div>
                                                    :
                                                    <Button
                                                        color="secondary"
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={this.updateApplication.bind(this, ind, application._id, "Reject")}>
                                                        Reject
                                                    </Button>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default RecruiterApplicationsDashboard;
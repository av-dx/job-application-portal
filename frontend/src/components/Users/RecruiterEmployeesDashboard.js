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
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';
import { Link } from 'react-router-dom';

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Rating from '@material-ui/lab/Rating';


class RecruiterEmployeesDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            employees: [],
            editing: 'none',
            newMaxApplications: '',
            newMaxPositions: '',
            newDeadline: '',
            sortBy: "none",
            sortAsc: true
        };

        this.onEditJob = this.onEditJob.bind(this);
        this.onDeleteJob = this.onDeleteJob.bind(this);
        this.onGiveRating = this.onGiveRating.bind(this);
        this.sortedIcon = this.sortedIcon.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByTitle = this.sortByTitle.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByRating = this.sortByRating.bind(this);

    }

    onGiveRating(event, id, index) {
        console.log([event, id, index]);
        var empArray = [...this.state.employees];
        empArray[index].rating = event.target.value;

        axios.post('http://localhost:4000/recruiter/rate/' + id, {
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password"),
            rating: event.target.value,
        }).then(response => {
            alert(response.data.error);
            this.setState({ employees: empArray })
        }).catch(error => {
            alert(error);
        })
    }

    sortByName() {
        var array = this.state.employees;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.name != undefined && b.name != undefined) {
                return (1 - flag * 2) * (1 - 2 * (new String(a.name) < new String(b.name)));
            }
            else {
                return 1;
            }
        });
        this.setState({
            employees: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "name"
        })
    }

    sortByTitle() {
        var array = this.state.employees;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.title != undefined && b.title != undefined) {
                return (1 - flag * 2) * (1 - 2 * (new String(a.title) < new String(b.title)));
            }
            else {
                return 1;
            }
        });
        this.setState({
            employees: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "title"
        })
    }

    sortByDate() {
        var array = this.state.employees;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.doj != undefined && b.doj != undefined) {
                return (1 - flag * 2) * (new Date(a.doj) - new Date(b.doj));
            }
            else {
                return 1;
            }
        });
        this.setState({
            employees: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "doj"
        })
    }
    sortByRating() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.employees;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.rating != undefined && b.rating != undefined) {
                return (1 - flag * 2) * (a - b.rating);
            }
            else {
                return 1;
            }
        });
        this.setState({
            employees: array,
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

    onEditJob(id, index) {
        console.log(id);
        const newLimit = {
            applications: this.state.newMaxApplications,
            positions: this.state.newMaxPositions
        }
        const newDeadline = this.state.newDeadline;
        axios.post('http://localhost:4000/job/' + id + '/edit', {
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password"),
            limit: newLimit,
            deadline: newDeadline,
        }).then(response => {
            console.log(response.data.error);
            var jobs = [...this.state.jobs];
            jobs[index].limit = newLimit;
            jobs[index].deadline = newDeadline;
            this.setState({ jobs: jobs, editing: 'none' });
        }).catch(error => {
            console.log(error);
        })
    }

    onDeleteJob(id, index) {
        console.log(id);
        axios.delete('http://localhost:4000/job/' + id, { data: { email: localStorage.getItem("email"), password: localStorage.getItem("password") } })
            .then(response => {
                console.log(response.data.error);
                var jobs = [...this.state.jobs];
                jobs.splice(index, 1);
                this.setState({ jobs: jobs });
            })
            .catch(error => {
                console.log(error.data.error);
            })
    }

    componentDidMount() {
        axios.post('http://localhost:4000/recruiter/activejobs', { email: localStorage.getItem("email"), password: localStorage.getItem("password") })
            .then(response => {
                this.setState({
                    jobs: response.data,
                    salarySortedJobs: response.data,
                    durationSortedJobs: response.data,
                    ratingSortedJobs: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            })
        axios.post('http://localhost:4000/recruiter/employees', { email: localStorage.getItem("email"), password: localStorage.getItem("password") })
            .then(response => {
                var resArray = response.data;
                var empArray = [];
                resArray.forEach(emp => {
                    empArray.push({
                        name: emp._applicant.name,
                        id: emp._applicant._id,
                        doj: emp.doj,
                        type: emp._job.type,
                        title: emp._job.title,
                        rating: emp._applicant.rating,
                    })
                });
                console.log(empArray)
                this.setState({
                    employees: empArray,
                });
            })
            .catch(function (error) {
                console.log(error);
            })
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
                                        <TableCell><Button onClick={this.sortByName}>Employee Name {this.sortedIcon("name")} </Button></TableCell>
                                        <TableCell><Button onClick={this.sortByDate}>Date of Joining {this.sortedIcon("doj")} </Button></TableCell>
                                        <TableCell>Job Type</TableCell>
                                        <TableCell><Button onClick={this.sortByTitle}>Job Title {this.sortedIcon("title")} </Button></TableCell>
                                        <TableCell><Button onClick={this.sortByRating}>Rating {this.sortedIcon("rating")} </Button></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.employees.map((employee, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{employee.name}</TableCell>
                                            <TableCell>{new Date(employee.doj).toLocaleDateString()}</TableCell>
                                            <TableCell>{employee.type}</TableCell>
                                            <TableCell>{employee.title}</TableCell>
                                            <TableCell><Rating
                                                name="rating"
                                                value={employee.rating}
                                                size="large"
                                                precision={0.5}
                                                onChange={(event, id, index) => { this.onGiveRating(event, employee.id, ind) }}
                                            /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div >
        )
    }
}

export default RecruiterEmployeesDashboard;
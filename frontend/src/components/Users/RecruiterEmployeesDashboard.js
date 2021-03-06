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

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Rating from '@material-ui/lab/Rating';


class RecruiterEmployeesDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            sortBy: "none",
            sortAsc: true,
            editing: "none",
            ratingToSave: '',
        };

        this.onGiveRating = this.onGiveRating.bind(this);
        this.sortedIcon = this.sortedIcon.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByTitle = this.sortByTitle.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByRating = this.sortByRating.bind(this);

    }

    onGiveRating(ind, employee) {
        var employees = [...this.state.employees]
        employees[ind].rating = this.state.ratingToSave;
        console.log(ind);

        axios.post('http://localhost:4000/recruiter/rateemployee/' + employee.id, {
            userid: localStorage.getItem("userid"),
            password: localStorage.getItem("password"),
            rating: this.state.ratingToSave,
        }).then(response => {
            alert(response.data.error);
            this.setState({ employees: employees, editing: "none" })
        }).catch(error => {
            alert(error.response.data.error);
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

    componentDidMount() {
        axios.post('http://localhost:4000/recruiter/employees', { userid: localStorage.getItem("userid"), password: localStorage.getItem("password") })
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
                                                name="rating-${id}"
                                                value={(ind == this.state.editing) ? this.state.ratingToSave : employee.rating}
                                                size="large"
                                                precision={0.5}
                                                readOnly={(ind != this.state.editing)}
                                                onChange={(event) => {
                                                    this.setState({ ratingToSave: event.target.value })
                                                }}
                                            />
                                                {(this.state.editing == ind) ?
                                                    <Button onClick={() => {
                                                        this.onGiveRating(ind, employee);
                                                    }}>Save Rating</Button>
                                                    :
                                                    <Button onClick={() => {
                                                        console.log(employee, ind);
                                                        this.setState({ editing: ind, ratingToSave: employee.rating })
                                                    }}>Start Rating</Button>
                                                }
                                            </TableCell>
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
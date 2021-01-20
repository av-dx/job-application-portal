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

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';


class RecruiterDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            salarySortedJobs: [],
            durationSortedJobs: [],
            ratingSortedJobs: [],
            sortBy: "none",
            sortAsc: true
        };
        this.sortedIcon = this.sortedIcon.bind(this);
        this.sortBySalary = this.sortBySalary.bind(this);
        this.sortByDuration = this.sortByDuration.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
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
    }

    sortBySalary() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.jobs;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.salary != undefined && b.salary != undefined) {
                return (1 - flag * 2) * (a.salary - b.salary);
            }
            else {
                return 1;
            }
        });
        this.setState({
            jobs: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "salary"
        })
    }
    sortByDuration() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.jobs;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.duration != undefined && b.duration != undefined) {
                return (1 - flag * 2) * (a.duration - b.duration);
            }
            else {
                return 1;
            }
        });
        this.setState({
            jobs: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "duration"
        })
    }
    sortByRating() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.jobs;
        var flag = this.state.sortAsc;
        array.sort(function (a, b) {
            if (a.rating != undefined && b.rating != undefined) {
                return (1 - flag * 2) * (a.rating - b.rating);
            }
            else {
                return 1;
            }
        });
        this.setState({
            jobs: array,
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
                <Grid container>
                    <Grid item xs={12} md={3} lg={3}>
                        <List component="nav" aria-label="mailbox folders">
                            <ListItem>
                                <h3>Filters</h3>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <List component="nav" aria-label="mailbox folders">
                            <TextField
                                id="standard-basic"
                                label="Search"
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </List>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={3} lg={3}>
                        <List component="nav" aria-label="mailbox folders">

                            <ListItem button>
                                <form noValidate autoComplete="off">
                                    <label>Salary</label>
                                    <TextField id="standard-basic" label="Enter Min" fullWidth={true} />
                                    <TextField id="standard-basic" label="Enter Max" fullWidth={true} />
                                </form>
                            </ListItem>
                            <Divider />
                            <ListItem button divider>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={this.state.jobs}
                                    getOptionLabel={(option) => option.name}
                                    style={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Select Names" variant="outlined" />}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Recruiter Name</TableCell>
                                        <TableCell><Button onClick={this.sortByDuration}>Duration</Button>{this.sortedIcon("duration")}</TableCell>
                                        <TableCell><Button onClick={this.sortBySalary}>Salary</Button>{this.sortedIcon("salary")}</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell><Button onClick={this.sortByRating}>Rating</Button>{this.sortedIcon("rating")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.jobs.map((job, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.recruitername}</TableCell>
                                            <TableCell>{job.duration}</TableCell>
                                            <TableCell>{job.salary}</TableCell>
                                            <TableCell>{job.deadline}</TableCell>
                                            <TableCell>{job.rating}</TableCell>
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

export default RecruiterDashboard;
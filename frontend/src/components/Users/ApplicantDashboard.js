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
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from '@material-ui/core/Slider'

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import { FormControl } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { Link } from 'react-router-dom';

class ApplicantDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appliedJobs: [],
            allJobs: [],
            displayedJobs: [],
            salarySortedJobs: [],
            durationSortedJobs: [],
            ratingSortedJobs: [],
            sortBy: "none",
            sortAsc: true,
            searchKey: '',
            filterType: '',
            filterDuration: 7,
            filterSalaryMin: 0,
            filterSalaryMax: 100000
        };
        this.sortedIcon = this.sortedIcon.bind(this);
        this.sortBySalary = this.sortBySalary.bind(this);
        this.sortByDuration = this.sortByDuration.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onFilter = this.onFilter.bind(this);
    }

    onChangeValue(event) {
        console.log(event);
        this.setState({ [event.target.name]: event.target.value });
    }

    componentDidMount() {
        axios.post('http://localhost:4000/applicant/login', {
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password")
        })
            .then(response => {
                let submittedApplications = response.data._applications;
                let appliedJobs = submittedApplications.map(a => a._job);
                console.log(response.data);
                axios.get('http://localhost:4000/job/')
                    .then(response => {
                        console.log(response);
                        this.setState({
                            appliedJobs: appliedJobs,
                            allJobs: response.data,
                            displayedJobs: response.data,
                            salarySortedJobs: response.data,
                            durationSortedJobs: response.data,
                            ratingSortedJobs: response.data
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })

    }

    onFilter() {
        var array = this.state.allJobs;
        var key = this.state.searchKey.toString().toLowerCase();
        array = array.filter(function (a) {
            return a.title.toString().toLowerCase().includes(key);
        })

        key = this.state.filterType.toString().toLowerCase();
        array = array.filter(function (a) {
            return a.type.toString().toLowerCase().includes(key);
        })

        var keyMin = new Number(this.state.filterSalaryMin);
        var keyMax = new Number(this.state.filterSalaryMax);
        array = array.filter(function (a) {
            return ((Number(a.salary) >= keyMin) && (Number(a.salary) <= keyMax));
        })

        keyMax = new Number(this.state.filterDuration);
        array = array.filter(function (a) {
            return (Number(a.duration) < keyMax);
        })
        this.setState({
            displayedJobs: array,
            sortBy: "none"
        })
    }

    sortBySalary() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.displayedJobs;
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
            displayedJobs: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "salary"
        })
    }
    sortByDuration() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.displayedJobs;
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
            displayedJobs: array,
            sortAsc: !this.state.sortAsc,
            sortBy: "duration"
        })
    }
    sortByRating() {
        /**
         *      Note that this is sorting only at front-end.
         */
        var array = this.state.displayedJobs;
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
            displayedJobs: array,
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
                                value={this.state.searchKey}
                                onChange={this.onChangeValue}
                                name="searchKey"
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            <IconButton onClick={this.onFilter}>
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
                                    <Slider
                                        min={0}
                                        max={100000}
                                        step={1000}
                                        value={[this.state.filterSalaryMin, this.state.filterSalaryMax]}
                                        onChange={(event, value) => { this.setState({ filterSalaryMin: value[0], filterSalaryMax: value[1] }) }}
                                        valueLabelDisplay="off"
                                        name="filterSalaryMin"
                                        aria-labelledby="range-slider"
                                    />
                                    <TextField
                                        id="standard-basic"
                                        label="Minimum Salary"
                                        fullWidth={true}
                                        value={this.state.filterSalaryMin}
                                        onChange={this.onChangeValue}
                                        name="filterSalaryMin"
                                        type="number"
                                        InputProps={{ inputProps: { min: 0, max: 100000 } }}
                                    />
                                    <TextField
                                        id="standard-basic"
                                        label="Maximum Salary"
                                        fullWidth={true}
                                        value={this.state.filterSalaryMax}
                                        onChange={this.onChangeValue}
                                        name="filterSalaryMax"
                                        type="number"
                                        InputProps={{ inputProps: { min: 0, max: 100000 } }}
                                    />
                                </form>
                            </ListItem>
                            <Divider />
                            <ListItem button divider>
                                <FormControl fullWidth>
                                    <label> Job Type </label>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={this.state.filterType}
                                        onChange={this.onChangeValue}
                                        name="filterType"
                                        displayEmpty
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <MenuItem value="">All Jobs</MenuItem>
                                        <MenuItem value="Full-Time">Full Time</MenuItem>
                                        <MenuItem value="Part-Time">Part Time</MenuItem>
                                        <MenuItem value="WFH">Work From Home</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItem>
                            <ListItem button divider>
                                <FormControl fullWidth>
                                    <label>Duration</label>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={this.state.filterDuration}
                                        onChange={this.onChangeValue}
                                        name="filterDuration"
                                        displayEmpty
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <MenuItem value={7}>Less than 7 months</MenuItem>
                                        <MenuItem value={6}>Less than 6 months</MenuItem>
                                        <MenuItem value={5}>Less than 5 months</MenuItem>
                                        <MenuItem value={4}>Less than 4 months</MenuItem>
                                        <MenuItem value={3}>Less than 3 months</MenuItem>
                                        <MenuItem value={2}>Less than 2 months</MenuItem>
                                        <MenuItem value={1}>Less than 1 month</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItem>
                            <ListItem divider>
                                <Button fullWidth onClick={this.onFilter}>Filter</Button>
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
                                        <TableCell><Button onClick={this.sortByDuration}>Duration{this.sortedIcon("duration")}</Button></TableCell>
                                        <TableCell><Button onClick={this.sortBySalary}>Salary{this.sortedIcon("salary")}</Button></TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell><Button onClick={this.sortByRating}>Rating{this.sortedIcon("rating")}</Button></TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.displayedJobs.map((job, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.recruitername}</TableCell>
                                            <TableCell>{job.duration}</TableCell>
                                            <TableCell>{job.salary}</TableCell>
                                            <TableCell>{job.deadline}</TableCell>
                                            <TableCell><Rating value={job.rating} readOnly></Rating>{Number.parseFloat(job.rating).toFixed(1)}</TableCell>
                                            <TableCell>
                                                {(this.state.appliedJobs.includes(job._id)) ?
                                                    <Button variant="contained" color="default">Applied</Button>
                                                    :
                                                    ((job.count.applications >= job.limit.applications) ||
                                                        (job.count.positions >= job.limit.positions))
                                                        ?
                                                        <Button variant="contained" color="secondary">Full</Button>
                                                        :
                                                        <Link to={{ pathname: "/application/create", state: { job: job } }} className="nav-link">
                                                            <Button variant="contained" color="primary">Apply</Button>
                                                        </Link>
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

export default ApplicantDashboard;
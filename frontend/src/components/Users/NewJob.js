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

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import { Typography } from '@material-ui/core';

export default class NewJob extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            limit_applications: 50,
            limit_positions: 20,
            deadline: Date.now(),
            skillset: '',
            type: 'Full-Time',
            duration: 2,
            salary: 40000,
        }

        this.onChangeValue = this.onChangeValue.bind(this);
        // this.onAddEducation = this.onAddEducation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // componentDidMount() {
    //     axios.get('http://localhost:4000/job/')
    //         .then(response => {
    //             this.setState({
    //                 jobs: response.data,
    //                 salarySortedJobs: response.data,
    //                 durationSortedJobs: response.data,
    //                 ratingSortedJobs: response.data
    //             });
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         })
    // }

    // onAddEducation() {
    //     this.setState({
    //         education: [...this.state.education, {
    //             institute: '', startYear: '', endYear: ''
    //         }]
    //     });
    // }

    onChangeValue(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newJob = {
            title: this.state.title,
            recruiteremail: localStorage.getItem("email"),
            recruiterKey: localStorage.getItem("password"),
            count: { applications: 0 },
            limit: {
                applications: this.state.limit_applications,
                positions: this.state.limit_positions
            },
            deadline: this.state.deadline,
            skillset: this.state.skillset,
            type: this.state.type,
            duration: this.state.duration,
            salary: this.state.salary,
            rating: 0,
            postedOn: Date.now()
        }
        axios.post('http://localhost:4000/job/postjob', newJob)
            .then(res => {
                alert("Added a Job : " + res.data.title);
                console.log(res.data);
                window.location = '/dashboard';
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data)
                    alert(err.response.data.error)
                }
            })

    }

    render() {

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Title</InputLabel>
                            <TextField className="form-control"
                                variant="outlined"
                                value={this.state.title}
                                onChange={this.onChangeValue}
                                required
                                name="title"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <InputLabel>Deadline</InputLabel>
                            <TextField className="form-control"
                                variant="outlined"
                                value={this.state.deadline}
                                onChange={this.onChangeValue}
                                required
                                name="deadline"
                                type="date"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <InputLabel>Job Type</InputLabel>
                            <FormControl className="form-group" variant="outlined">
                                <Select
                                    value={this.state.type}
                                    onChange={this.onChangeValue}
                                    name="type"
                                >
                                    <MenuItem value={'Full-Time'}>Full Time</MenuItem>
                                    <MenuItem value={'Part-Time'}>Part Time</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={9}>
                            <InputLabel>Skillset Required</InputLabel>
                            <TextField className="form-control"
                                variant="outlined"
                                value={this.state.skillset}
                                onChange={this.onChangeValue}
                                required
                                name="skillset"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel>Duration in months</InputLabel>
                            <TextField className="form-control"
                                variant="outlined"
                                value={this.state.duration}
                                onChange={this.onChangeValue}
                                required
                                name="duration"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Salary</InputLabel>
                            <TextField className="form-control"
                                variant="outlined"
                                value={this.state.salary}
                                onChange={this.onChangeValue}
                                required
                                name="salary"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={6}>
                                <Grid item xs={6}>
                                    <InputLabel>Application Limit</InputLabel>
                                    <TextField className="form-control"
                                        variant="outlined"
                                        helperText="Maximum applications allowed"
                                        value={this.state.limit_applications}
                                        onChange={this.onChangeValue}
                                        required
                                        name="limit_applications"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel>Number of positions</InputLabel>
                                    <TextField className="form-control"
                                        variant="outlined"
                                        helperText="Maximum number of positions for the job"
                                        value={this.state.limit_positions}
                                        onChange={this.onChangeValue}
                                        required
                                        name="limit_positions"
                                        type="number"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                color="primary"
                                variant="contained"
                                onClick={this.onSubmit}>
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </form >
            </div >
        )
    }
}
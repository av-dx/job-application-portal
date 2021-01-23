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


class RecruiterDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            editing: 'none',
            newMaxApplications: '',
            newMaxPositions: '',
            newDeadline: '',
        };

        this.onEditJob = this.onEditJob.bind(this);
        this.onDeleteJob = this.onDeleteJob.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);


    }

    onChangeValue(event) {
        this.setState({ [event.target.name]: event.target.value });
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
                                        <TableCell>Title</TableCell>
                                        <TableCell>Date of posting</TableCell>
                                        <TableCell>Applications (Submitted/Max)</TableCell>
                                        <TableCell>Number of positions</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.jobs.map((job, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell><Link to={{ pathname: "/job/applications", state: { job: job } }} >{job.title}</Link></TableCell>
                                            <TableCell>{new Date(job.postedOn).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {job.count.applications}/
                                            {(this.state.editing == ind) ?
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        className="form-control"
                                                        value={this.state.newMaxApplications}
                                                        onChange={this.onChangeValue}
                                                        name="newMaxApplications"
                                                        type="number"
                                                        required
                                                    />
                                                    :
                                                    job.limit.applications
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {job.count.positions}/
                                            {(this.state.editing == ind) ?
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        className="form-control"
                                                        value={this.state.newMaxPositions}
                                                        onChange={this.onChangeValue}
                                                        name="newMaxPositions"
                                                        type="number"
                                                        required
                                                    />
                                                    :
                                                    job.limit.positions
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {(this.state.editing == ind) ?
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        className="form-control"
                                                        value={this.state.newDeadline.toString().replace('Z', '')}
                                                        onChange={this.onChangeValue}
                                                        name="newDeadline"
                                                        type="datetime-local"
                                                        required
                                                    />
                                                    :
                                                    new Date(job.deadline).toLocaleString()
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {(this.state.editing == ind) ?
                                                    <Button color="primary" onClick={this.onEditJob.bind(this, job._id, ind)}>
                                                        <DoneIcon></DoneIcon>
                                                    </Button>
                                                    :
                                                    <Button color="primary" onClick={() => {
                                                        this.setState({
                                                            editing: ind,
                                                            newDeadline: job.deadline,
                                                            newMaxPositions: job.limit.positions,
                                                            newMaxApplications: job.limit.applications
                                                        })
                                                    }}>
                                                        <EditIcon></EditIcon>
                                                    </Button>
                                                }
                                                <Button color="secondary" onClick={this.onDeleteJob.bind(this, job._id, ind)}>
                                                    <DeleteForeverIcon></DeleteForeverIcon>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { window.location = '/job/create' }}>
                            Create a new Job
                        </Button>
                    </Grid>
                </Grid>
            </div >
        )
    }
}

export default RecruiterDashboard;
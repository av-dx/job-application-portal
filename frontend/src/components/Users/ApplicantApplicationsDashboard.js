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
import Rating from '@material-ui/lab/Rating';


class RecruiterApplicationsDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            applications: []
        };
        this.rateJob = this.rateJob.bind(this);
    }

    componentDidMount() {
        axios.post('http://localhost:4000/applicant/postedapplications', {
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password")
        })
            .then(response => {
                this.setState({
                    applications: response.data,
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    rateJob(event, index, applicationid, jobid) {
        const rating = Number.parseFloat(event.target.value);
        console.log([event, index, applicationid, jobid, rating]);
        axios.post('http://localhost:4000/job/' + jobid + '/rate', {
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password"),
            applicationid: applicationid,
            rating: rating,
        })
            .then(response => {
                var arr = [...this.state.applications];
                const ratedBy = Number.parseFloat(arr[index]._job.ratedBy);
                const currating = Number.parseFloat(arr[index]._job.rating);
                arr[index]._job.rating = (currating * ratedBy + rating) / (ratedBy + 1);
                arr[index]._job.ratedBy += 1;
                this.setState({
                    applications: arr,
                })
                alert(response.data.error);
            })
            .catch(function (error) {
                alert(error.response.data.error);
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
                                        <TableCell align="center">Job Title</TableCell>
                                        <TableCell align="center">Date of Joining</TableCell>
                                        <TableCell align="center">Salary</TableCell>
                                        <TableCell align="center">Recruiter</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="center">Rating</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.applications.map((application, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell align="center">{application._job.title}</TableCell>
                                            <TableCell align="center">{(application.status == "Accepted") ? new Date(application.doj).toLocaleDateString() : "Not Applicable"}</TableCell>
                                            <TableCell align="center">{application._job.salary}</TableCell>
                                            <TableCell align="center">{application._job.recruitername}</TableCell>
                                            <TableCell align="center">{application.status}</TableCell>
                                            <TableCell align="center">
                                                <Rating
                                                    name="rating"
                                                    value={application._job.rating}
                                                    size="large"
                                                    precision={0.5}
                                                    onChange={(event, id, applicationid, jobid) => {
                                                        this.rateJob(event, ind, application._id, application._job._id)
                                                    }}
                                                />
                                                {Number.parseFloat(application._job.rating).toFixed(1)}
                                            </TableCell>
                                            <TableCell align="center">
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
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
import { InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl'
import Rating from '@material-ui/lab/Rating'
import FormHelperText from '@material-ui/core/FormHelperText'

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            education: [],
            skills: [],
            rating: 0,
            resume: [],
            profilepic: ''
        }

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onAddEducation = this.onAddEducation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onAddEducation() {
        this.setState({
            education: [...this.state.education, {
                institute: '', startYear: '', endYear: ''
            }]
        });
    }

    onChangeValue(event) {
        if (["institute", "startYear", "endYear"].includes(event.target.name)) {
            let edu = [...this.state.education]
            edu[event.target.id][event.target.name] = event.target.value;
            this.setState({ edu });
        }
        else {
            this.setState({ [event.target.name]: event.target.value });
        }
    }


    onSubmit(e) {
        e.preventDefault();
        const newApplicant = {
            name: this.state.name,
            curemail: localStorage.getItem("email"),
            email: this.state.email,
            education: this.state.education,
            skills: this.state.skills,
            password: localStorage.getItem("password"),
        }
        axios.post('http://localhost:4000/applicant/edit', newApplicant)
            .then(res => {
                alert("Account info updated!");
                console.log(res.data);
                window.location = '/profile';
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data)
                    alert(err.response.data.error)
                }
            })
    }


    componentDidMount() {
        axios.post('http://localhost:4000/applicant/login', { email: localStorage.getItem("email"), password: localStorage.getItem("password") })
            .then(application => {
                this.setState(application.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                <Grid container alignItems="center" spacing={6}>
                    <Grid item xs={4}>
                        <InputLabel>Profile Picture</InputLabel>
                        <div style={{ width: 200, height: 200, background: "blue" }}></div>
                    </Grid>

                    <Grid item xs={8}>
                        <Grid container spacing={6}>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    value={this.state.email}
                                    name="email"
                                    label="Email"
                                    type="Email"
                                    onChange={this.onChangeValue}
                                    className="form-control"
                                    required
                                    helperText="Changing this will require you to re-login!"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    value={this.state.name}
                                    name="name"
                                    label="Username"
                                    onChange={this.onChangeValue}
                                    className="form-control"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    value={this.state.skills}
                                    name="skills"
                                    label="Skills"
                                    onChange={this.onChangeValue}
                                    className="form-control"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Education Details</InputLabel>
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <Grid container spacing={6}>
                                    {this.state.education.map((edu, ind) => {
                                        return (
                                            <Grid container item spacing={3} key={ind}>
                                                <Grid item xs={1} sm={1}>
                                                    <TextField
                                                        variant="outlined"
                                                        value={ind + 1}
                                                        className="form-control"
                                                    />
                                                </Grid>
                                                <Grid item xs={11} sm={5}>
                                                    <TextField
                                                        variant="outlined"
                                                        label="Institute Name"
                                                        value={this.state.education[ind].institute}
                                                        onChange={this.onChangeValue}
                                                        name="institute"
                                                        id={ind}
                                                        required
                                                        className="form-control"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        variant="outlined"
                                                        label="Start Year"
                                                        value={this.state.education[ind].startYear}
                                                        onChange={this.onChangeValue}
                                                        name="startYear"
                                                        id={ind}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        variant="outlined"
                                                        label="End Year"
                                                        value={(["undefined", "null"].includes(String(this.state.education[ind].endYear))) ? '' : this.state.education[ind].endYear}
                                                        onChange={this.onChangeValue}
                                                        name="endYear"
                                                        className="form-control"
                                                        type="number"
                                                        id={ind}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </Grid >

                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            color="primary"
                            variant="contained"
                            onClick={this.onSubmit}>
                            Done
                            </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Profile;
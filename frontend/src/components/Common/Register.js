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

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            type: 'Applicant',
            date: null,
            password: '',
            education: [

            ],
            skills: [],
            rating: 0,
            resume: [],
            profilepic: '',
            contact: '',
            bio: ''

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

    renderTypeBasedFields() {
        if (this.state.type == "Recruiter") {
            return (
                <Grid container spacing={6}>
                    <Grid item xs={12} sm={3}>
                        <TextField className="form-control"
                            variant="outlined"
                            label="Contact"
                            value={this.state.contact}
                            onChange={this.onChangeValue}
                            name="contact"
                            type="tel"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputLabel>Bio</InputLabel>
                        <TextareaAutosize className="form-control"
                            variant="outlined"
                            label="Bio"
                            placeholder="Write a short bio (Max 250 words)"
                            value={this.state.bio}
                            onChange={this.onChangeValue}
                            name="bio"
                        />
                    </Grid>
                </Grid>
            )
        }
        else {
            return (
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        {/* TODO: Skill dropdown whatever */}
                        <TextField className="form-control"
                            variant="outlined"
                            label="Skills"
                            value={this.state.skills}
                            onChange={this.onChangeValue}
                            disabled
                            name="skills"
                        />
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            color="primary"
                            variant="contained"
                            onClick={this.onAddEducation}>
                            Add an Education
                            </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={6}>
                            {this.state.education.map((edu, ind) => {
                                let instID = "education[${ind}].institute",
                                    startID = "education[${ind}].startYear",
                                    endID = "education[${ind}].endYear";
                                return (
                                    <Grid container item spacing={6} key={ind}>
                                        <Grid item xs={12} sm={5}>
                                            <TextField className="form-control"
                                                variant="outlined"
                                                label="Institute Name"
                                                value={this.state.education[ind].institute}
                                                onChange={this.onChangeValue}
                                                name="institute"
                                                id={ind}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField className="form-control"
                                                variant="outlined"
                                                label="Start Year"
                                                value={this.state.education[ind].startYear}
                                                onChange={this.onChangeValue}
                                                name="startYear"
                                                id={ind}
                                                required
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField className="form-control"
                                                variant="outlined"
                                                label="End Year"
                                                value={(["undefined", "null"].includes(String(this.state.education[ind].endYear))) ? '' : this.state.education[ind].endYear}
                                                onChange={this.onChangeValue}
                                                name="endYear"
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

            )
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.type == "Recruiter") {
            const newRecruiter = {
                name: this.state.name,
                email: this.state.email,
                contact: this.state.contact,
                bio: this.state.bio,
                password: this.state.password,
                date: Date.now(),
            }
            axios.post('http://localhost:4000/recruiter/register', newRecruiter)
                .then(res => {
                    alert("Added a recruiter : " + res.data.name);
                    console.log(res.data);
                    window.location = '/';
                })
                .catch(err => {
                    if (err.response) {
                        console.log(err.response.data)
                        alert(err.response.data.error)
                    }
                })

        }
        else {
            const newApplicant = {
                name: this.state.name,
                email: this.state.email,
                education: this.state.education,
                skills: this.state.skills,
                password: this.state.password,
                date: Date.now(),
            }
            axios.post('http://localhost:4000/applicant/register', newApplicant)
                .then(res => {
                    alert("Added an applicant : " + res.data.name);
                    console.log(res.data);
                    window.location = '/';
                })
                .catch(err => {
                    if (err.response) {
                        console.log(err.response.data)
                        alert(err.response.data.error)
                    }
                })
        }


    }

    render() {

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6}>
                            <TextField className="form-control"
                                variant="outlined"
                                label="Username"
                                value={this.state.name}
                                onChange={this.onChangeValue}
                                required
                                name="name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField className="form-control"
                                variant="outlined"
                                label="Email"
                                value={this.state.email}
                                onChange={this.onChangeValue}
                                required
                                name="email"
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl className="form-group" variant="outlined">
                                <InputLabel>Account Type</InputLabel>
                                <Select
                                    value={this.state.type}
                                    onChange={this.onChangeValue}
                                    label="Account Type"
                                    name="type"
                                >
                                    <MenuItem value={'Applicant'}>Applicant</MenuItem>
                                    <MenuItem value={'Recruiter'}>Recruiter</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {this.renderTypeBasedFields()}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField className="form-control"
                                variant="outlined"
                                label="Password"
                                value={this.state.password}
                                onChange={this.onChangeValue}
                                required
                                name="password"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}> </Grid>
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
                </form>
            </div>
        )
    }
}
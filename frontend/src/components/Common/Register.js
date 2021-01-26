import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";


import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import ClearIcon from '@material-ui/icons/Clear';

import bcryptjs from 'bcryptjs';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            type: 'Applicant',
            date: null,
            password: '',
            education: [],
            skills: new Set(),
            skilltoadd: 'C++',
            rating: 0,
            resume: '',
            profilepic: '',
            contact: '',
            bio: '',
            presetskills: ['C++', 'Java', 'Python'],
            confirmPassword: '',
        }

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onAddEducation = this.onAddEducation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onAddEducation() {
        this.setState({
            education: [...this.state.education, {
                institute: '', startYear: 2000, endYear: ''
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
                    <Grid item xs={12}>
                        {[...this.state.skills].map((skill, ind) => {
                            return (
                                <Button
                                    key={ind}
                                    variant="contained"
                                    style={{ height: 40 }}
                                    endIcon={
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                var skills = new Set(this.state.skills);
                                                skills.delete(skill);
                                                this.setState({ skills: skills });
                                            }}>
                                            <ClearIcon />
                                        </IconButton>}
                                >
                                    {skill}
                                </Button>
                            )
                        })}
                    </Grid>
                    <Grid item xs={8}>
                        <Autocomplete
                            freeSolo
                            autoComplete
                            autoSelect
                            options={this.state.presetskills}
                            value={this.state.skilltoadd}
                            onChange={(event, value) => {
                                this.setState({ skilltoadd: value });
                            }}
                            name="skilltoadd"
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Skill"
                                    variant="outlined"
                                />

                            )
                            }
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            color="Primary"
                            variant="contained"
                            onClick={() => {
                                if ((this.state.skilltoadd != '') && (this.state.skilltoadd != undefined)) {
                                    var skills = new Set(this.state.skills);
                                    skills.add(this.state.skilltoadd);
                                    this.setState({ skills: skills, skilltoadd: '' });
                                }
                            }}>
                            Add this skill
                        </Button>
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
                                return (
                                    <Grid container item spacing={6} key={ind}>
                                        <Grid item xs={1} sm={1}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => {
                                                    var educations = [...this.state.education]
                                                    educations.splice(ind, 1);
                                                    this.setState({ education: educations });
                                                }}
                                                id={ind}
                                            > Remove
                                            </Button>
                                        </Grid>
                                        <Grid item xs={11} sm={4}>
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
                                                InputProps={{ inputProps: { min: 1000, max: 2021 } }}
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
                                                InputProps={{ inputProps: { min: 1000, max: 2050 } }}
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

        if (this.state.password != this.state.confirmPassword) {
            alert("The passwords do not match!");
            return;
        }

        bcryptjs.hash(this.state.password, '$2a$10$80AawQoTPT9073a4cfUDJe').then(hash => {
            var secHash = hash.slice(29);
            if (this.state.type == "Recruiter") {
                const newRecruiter = {
                    name: this.state.name,
                    email: this.state.email,
                    contact: this.state.contact,
                    bio: this.state.bio,
                    password: secHash,
                    date: Date.now(),
                }
                axios.post('http://localhost:4000/recruiter/register', newRecruiter)
                    .then(res => {
                        alert("Added a recruiter : " + res.data.name);
                        console.log(res.data);

                        axios.post('http://localhost:4000/recruiter/login', newRecruiter)
                            .then((res) => {
                                localStorage.setItem("userid", res.data._id);
                                localStorage.setItem("name", newRecruiter.name);
                                localStorage.setItem("email", newRecruiter.email);
                                localStorage.setItem("password", newRecruiter.password);
                                localStorage.setItem("type", "recruiter");
                                window.location = '/';
                            })
                            .catch(err => {
                                if (err.response) {
                                    console.log(err.response.data)
                                    alert(err.response.data.error)
                                }
                            })
                    })
                    .catch(err => {
                        if (err) {
                            alert(err.response.data.error);
                        }
                    })
            }
            else {
                const newApplicant = {
                    name: this.state.name,
                    email: this.state.email,
                    education: this.state.education,
                    skills: Array.from(this.state.skills),
                    password: secHash,
                    date: Date.now(),
                }
                axios.post('http://localhost:4000/applicant/register', newApplicant)
                    .then(res => {
                        alert("Added an applicant : " + res.data.name);
                        console.log(res.data);

                        axios.post('http://localhost:4000/applicant/login', newApplicant)
                            .then((res) => {
                                localStorage.setItem("userid", res.data._id);
                                localStorage.setItem("name", newApplicant.name);
                                localStorage.setItem("email", newApplicant.email);
                                localStorage.setItem("password", newApplicant.password);
                                localStorage.setItem("type", "applicant");
                                window.location = '/';
                            })
                            .catch(err => {
                                if (err.response) {
                                    console.log(err.response.data)
                                    alert(err.response.data.error)
                                }
                            })
                    })
                    .catch(err => {
                        if (err.response) {
                            console.log(err.response.data)
                            alert(err.response.data.error)
                        }
                    })
            }
        }).catch(err => {
            alert(err);
            return;
        })
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
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField className="form-control"
                                        variant="outlined"
                                        label="Password"
                                        value={this.state.password}
                                        onChange={this.onChangeValue}
                                        required
                                        name="password"
                                        type="password"
                                    /></Grid>
                                <Grid item xs={12}>
                                    <TextField className="form-control"
                                        variant="outlined"
                                        label="Re-enter password"
                                        value={this.state.confirmPassword}
                                        onChange={this.onChangeValue}
                                        required
                                        name="confirmPassword"
                                        type="password"
                                    />
                                </Grid>
                            </Grid>

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
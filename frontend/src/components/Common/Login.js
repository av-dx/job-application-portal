import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import bcryptjs from 'bcryptjs';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            type: 'Applicant',
            password: ''
        }
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeValue(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        bcryptjs.hash(this.state.password, '$2a$10$80AawQoTPT9073a4cfUDJe').then(hash => {
            var secHash = hash.slice(29);
            // "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.      q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa"
            console.log(secHash);
            if (this.state.type == "Recruiter") {
                const recruiter = {
                    email: this.state.email,
                    password: secHash
                }
                axios.post('http://localhost:4000/recruiter/login', recruiter)
                    .then(res => {
                        localStorage.setItem("email", recruiter.email);
                        localStorage.setItem("password", recruiter.password);
                        localStorage.setItem("type", "recruiter");
                        localStorage.setItem("name", res.data.name);
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
                const applicant = {
                    email: this.state.email,
                    password: secHash,
                }
                axios.post('http://localhost:4000/applicant/login', applicant)
                    .then(res => {
                        localStorage.setItem("email", applicant.email);
                        localStorage.setItem("password", applicant.password);
                        localStorage.setItem("type", "applicant");
                        localStorage.setItem("name", res.data.name);
                        window.location = '/';
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
                                label="Email"
                                value={this.state.email}
                                onChange={this.onChangeValue}
                                required
                                name="email"
                                type="email"
                            />
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
                        <Grid item xs={12} sm={6}> </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                color="primary"
                                variant="contained"
                                onClick={this.onSubmit}>
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        )
    }
}
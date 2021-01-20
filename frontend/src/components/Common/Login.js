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

        if (this.state.type == "Recruiter") {
            const recruiter = {
                email: this.state.email,
                password: this.state.password
            }
            axios.post('http://localhost:4000/recruiter/login', recruiter)
                .then(res => {
                    localStorage.setItem("email", recruiter.email);
                    localStorage.setItem("password", recruiter.password);
                    localStorage.setItem("type", "recruiter");
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
                password: this.state.password,
            }
            axios.post('http://localhost:4000/applicant/login', applicant)
                .then(res => {
                    localStorage.setItem("email", applicant.email);
                    localStorage.setItem("password", applicant.password);
                    localStorage.setItem("type", "applicant");
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
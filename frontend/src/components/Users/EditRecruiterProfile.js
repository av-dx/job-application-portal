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
import TextareaAutosize from '@material-ui/core/TextareaAutosize'

class EditRecruiterProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            contact: '',
            bio: '',
        }

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeValue(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const newRecruiter = {
            name: this.state.name,
            curemail: localStorage.getItem("email"),
            email: this.state.email,
            contact: this.state.contact,
            bio: this.state.bio,
            password: localStorage.getItem("password"),
        }
        axios.post('http://localhost:4000/recruiter/edit', newRecruiter)
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
        axios.post('http://localhost:4000/recruiter/login', { email: localStorage.getItem("email"), password: localStorage.getItem("password") })
            .then(recruiter => {
                this.setState(recruiter.data);
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

                            </Grid>
                            <Grid item xs={6}>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Company Bio</InputLabel>
                        <TextareaAutosize
                            value={this.state.bio}
                            className="form-control"
                            name="bio"
                            onChange={this.onChangeValue}>
                        </TextareaAutosize>
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

export default EditRecruiterProfile;
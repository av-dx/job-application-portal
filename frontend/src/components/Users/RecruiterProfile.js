import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { InputLabel, TextareaAutosize } from '@material-ui/core';

class RecruiterProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            contact: '',
            bio: '',
        }

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
                    <Grid item xs={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <InputLabel>Email</InputLabel>
                                <TextField
                                    variant="outlined"
                                    value={this.state.email}
                                    className="form-control"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel>Username</InputLabel>
                                <TextField
                                    variant="outlined"
                                    value={this.state.name}
                                    className="form-control"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel>Contact</InputLabel>
                                <TextField
                                    variant="outlined"
                                    value={this.state.contact}
                                    className="form-control"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Company Bio</InputLabel>
                        <TextareaAutosize value={this.state.bio} className="form-control">
                        </TextareaAutosize>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            color="primary"
                            variant="contained"
                            onClick={() => { window.location = '/profile/edit' }}>
                            Edit Profile
                            </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default RecruiterProfile;
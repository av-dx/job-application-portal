import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";

import { InputLabel } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText'
import ClearIcon from '@material-ui/icons/Clear'

class EditApplicantProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            name: '',
            email: '',
            education: [],
            skills: new Set(),
            rating: 0,
            resume: [],
            profilepic: '',
            presetskills: ['C++', 'Java', 'Python']
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
            skills: Array.from(this.state.skills),
            password: localStorage.getItem("password"),
        }
        axios.post('http://localhost:4000/applicant/edit', newApplicant)
            .then(res => {
                localStorage.setItem("email", newApplicant.email);
                localStorage.setItem("name", newApplicant.name);
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
                        <img width={300} src={"http://localhost:4000/applicant/profilepic/" + this.state._id} />
                        <FormHelperText>
                            <input type="file" accept=".png, .jpg, .jpeg" name="profilepic" onChange={(event) => {
                                const newPhoto = new FormData();
                                newPhoto.append('curemail', localStorage.getItem("email"));
                                newPhoto.append('password', localStorage.getItem("password"));
                                newPhoto.append('profilepic', event.target.files[0]);
                                axios.post('http://localhost:4000/applicant/uploadphoto', newPhoto).then(() => {
                                    alert("Photo uploaded!");
                                })
                                    .catch(function (error) {
                                        console.log(error);
                                        alert(error.response.data.error);
                                    })
                            }} />
                        </FormHelperText>
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
                            <Grid item xs={6}>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Education Details</InputLabel>
                        <Grid container spacing={6}>
                            <Grid item xs={4}>
                                <Button
                                    type="button"
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
                                            <Grid container item spacing={3} key={ind}>
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

export default EditApplicantProfile;
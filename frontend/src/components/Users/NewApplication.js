import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import InputLabel from "@material-ui/core/InputLabel";
import TextareaAutosize from "@material-ui/core/TextareaAutosize"


export default class NewApplication extends Component {
    constructor(props) {
        super(props);

        this.state = {
            job: this.props.location.state.job,
            sop: '',
            postedOn: Date.now(),
        }

        this.onChangeValue = this.onChangeValue.bind(this);
        // this.onAddEducation = this.onAddEducation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
        if (this.state.job.recruitername == '') {
            alert("Please do not refresh the application submition page! You will be redirected to your dashboard.");
            window.location = '/dashboard';
        }
    }

    // onAddEducation() {
    //     this.setState({
    //         education: [...this.state.education, {
    //             institute: '', startYear: '', endYear: ''
    //         }]
    //     });
    // }

    onChangeValue(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newApplication = {
            jobid: this.state.job._id,
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password"),
            sop: this.state.sop,
        }
        axios.post('http://localhost:4000/application/create', newApplication)
            .then(res => {
                alert("Submitted succesfully Application");
                console.log(res.data);
                window.location = '/dashboard';
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data)
                    alert(err.response.data.error)
                }
            })

    }

    render() {

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <h1>Submit Application</h1>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <h3>Recruiter Name : {this.state.job.recruitername}</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h3>Job Title : {this.state.job.title}</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h3>Job Type : {this.state.job.type}</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h3>Duration : {this.state.job.duration} month(s)</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h3>Salary : {this.state.job.salary}</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h3>Skillset required : {this.state.job.skillset}</h3>
                        </Grid>

                        <Grid item xs={12} sm={9}>
                            <InputLabel>Statement of Purpose</InputLabel>
                            <TextareaAutosize className="form-control"
                                variant="outlined"
                                value={this.state.sop}
                                onChange={this.onChangeValue}
                                required
                                name="sop"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                color="primary"
                                variant="contained"
                                onClick={this.onSubmit}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form >
            </div >
        )
    }
}
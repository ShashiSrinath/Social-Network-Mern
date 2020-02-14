import React, {useState} from 'react';
import axios from 'axios';
import {API_URL} from '../../../constants';
import Spinner from "../../layouts/Spinner/Spinner";

const Register = (props) => {
    const [state, setState] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        password2: '',
        errors: null,
    });
    const [isLoading , setLoading] = useState(false);

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)
        const newUser = state;
        axios.post(`${API_URL}/auth/register`, newUser)
            .then(res => {
                props.history.push('/login');
                setLoading(false);
            })
            .catch(err => {
                console.log(err.response);
                setState({...state , errors: [err.response.data]});
                setLoading(false);
            });
    };

    return (
        <div className="row">
            {state.errors && state.errors.map((e, i) => (
                <div className="alert alert-danger alert-dismissible fade show" style={{width: '100%'}} role="alert"
                     key={i}>
                    {e.message}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ))}
            <section id="register" className="col-md-6 offset-md-3">
                <h2 className="mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="username" id="username" name="username" value={state.username}
                               onChange={handleChange} className="form-control form-control-lg"
                               placeholder="SuperCool Guy"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Name</label>
                        <input type="text" id="name" name="name" value={state.name}
                               onChange={handleChange} className="form-control form-control-lg"
                               placeholder="Your Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={state.email}
                               onChange={handleChange} className="form-control form-control-lg"
                               placeholder="example@example.com"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={state.password}
                               onChange={handleChange} className="form-control form-control-lg"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password" id="password2" name="password2" value={state.password2}
                               onChange={handleChange} className="form-control form-control-lg"/>
                    </div>
                    <button type="submit" className="btn btn-primary float-right" disabled={isLoading}>Register {isLoading && <Spinner />}</button>
                </form>
            </section>
        </div>
    );
};

export default Register;

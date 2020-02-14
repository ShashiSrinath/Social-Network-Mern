import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../../../constants';
import {GlobalContext} from "../../../context/GlobalState";
import {withRouter} from "react-router-dom";
import mangeJWT from "../../../util/mangeJWT";
import Spinner from "../../layouts/Spinner/Spinner";

const Login = (props) => {
    const {user} = useContext(GlobalContext);

    const [state, setState] = useState({
        email: '',
        password: '',
        error: null,
    });
    const [isLoading , setLoading] = useState(false);

    useEffect(() => {
        if (user.state) {
            props.history.push('/profile');
        }
    });

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        axios.post(`${API_URL}/auth/login`, state)
            .then(res => {
                console.log(res);
                mangeJWT.set(res.data.token);
                axios.get(`${API_URL}/users`)
                    .then(res => {
                        user.setState(res.data.user);
                        setLoading(false);
                        props.history.push('/profile');
                    });
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.data) {
                    setState({...state, error: err.response.data.message});
                }
                setLoading(false);
            });
    };

    return (
        <div className="row">
            {state.error && (
                <div className="alert alert-danger alert-dismissible fade show" style={{width: '100%'}}
                     role="alert">
                    {state.error}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
            <section id="login" className="col-md-6 offset-md-3">
                <h2 className="mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={state.email} onChange={handleChange}
                               className="form-control form-control-lg" placeholder="example@example.com"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Password</label>
                        <input type="password" id="password" name="password" value={state.password}
                               onChange={handleChange} className="form-control form-control-lg"/>
                    </div>
                    <button type="submit" className="btn btn-primary float-right" disabled={isLoading}>Login {isLoading && <Spinner />}</button>
                </form>
            </section>
        </div>
    );
};

export default withRouter(Login);

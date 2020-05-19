import React, {useState} from 'react'
import './searchForm.scss';
import {withRouter} from "react-router-dom";

const SearchForm = (props) => {
    const [query, setQuery] = useState('');

    const handleInput = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.history.push(`/s/${query}`);
        setQuery('');
    };

    return (
                <form className="form-inline " onSubmit={handleSubmit}>
                    <input className="form-control" type="search" placeholder="Search user" aria-label="Search"
                           value={query} onChange={handleInput}/>
                    <button className="btn btn-search btn-success" type="submit">Search</button>
                </form>
    )
};

export default withRouter(SearchForm);

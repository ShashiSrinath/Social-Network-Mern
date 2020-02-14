import React,{useState} from 'react';
import {withRouter} from "react-router-dom";
import axios from 'axios';
import {API_URL} from "../../../constants";
import SearchResult from "./SearchResult";


const SearchFeed = (props) => {
    const [posts, setPosts] = useState([]);

    console.log(props.match.params.id);
    useState(() => {
        axios.get(`${API_URL}/users/search/${props.match.params.id}`)
            .then(res => {
                setPosts(res.data.users);
            })
    });

    return (
        <div className='mt-5 d-flex align-items-center flex-column'>
            {posts.map(post => (<SearchResult key={post._id} data={post}/>))}
        </div>
    )
};

export default withRouter(SearchFeed);

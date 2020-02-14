import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import {API_URL} from "../../../constants";
import Post from "../../layouts/Post/Post";
import ErrorContainer from "../../layouts/Error/ErrorNotFound";
import {GlobalContext} from "../../../context/GlobalState";

const ViewPost = (props) => {
    const {user} = useContext(GlobalContext);
    const [post, setPost] = useState(undefined);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/posts/${props.match.params.id}`)
            .then(res => {
                setPost(res.data.post);
            })
            .catch(err => {
                setErr(true);
                setLoading(false);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (post) setLoading(false);
    }, [post]);


    const Loading = () => (
        <div className='d-flex justify-content-center'>
            <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );

    const output = () => {
        if (loading) return (<Loading/>);
        if (err) return (<ErrorContainer/>);

        return (<Post data={post} currentUser={user.state} singlePost={true} editable={user.state._id === post.user._id}/>)
    };

    return (
        <div className='d-flex justify-content-center mt-5 mb-5'>
            {output()}
        </div>
    )
};

export default withRouter(ViewPost)

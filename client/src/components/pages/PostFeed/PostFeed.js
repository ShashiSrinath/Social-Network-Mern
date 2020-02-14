import React, {useContext, useEffect, useState} from 'react';
import Post from "../../layouts/Post/Post";
import {withRouter} from 'react-router-dom';
import {GlobalContext} from "../../../context/GlobalState";
import CenterSpinner from "../../layouts/Spinner/CenterSpinner";
import useApiRequest from "../../../hooks/useApiRequest/useApiRequest";
import {SET_POSTS} from "../../../context/postReducer/postActions";

const Feed = (props) => {
    const {posts, user: {state: userState}} = useContext(GlobalContext);
    const {apiRequest, isLoading} = useApiRequest();

    useEffect(() => {
        apiRequest({
            options: {method: 'get', path: '/posts'},
            onSuccess: {dispatch: posts.dispatch , action: SET_POSTS}
        });
    }, []);


    return (
        <div>
            <div className='d-flex mt-5 justify-content-end'>

                <button className='btn btn-outline-success ' onClick={() => props.history.push('/create-post')}>Create A
                    Post
                </button>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <div className='mt-4'>
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            {isLoading && <CenterSpinner/>}
                            {posts.state.map(post => (
                                <Post key={post._id} data={post} currentUser={userState}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Feed);

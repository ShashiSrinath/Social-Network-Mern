import React, {useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import Post from "../../layouts/Post/Post";
import {GlobalContext} from "../../../context/GlobalState";
import {SET_POSTS} from "../../../context/postReducer/postActions";
import useApiRequest from "../../../hooks/useApiRequest/useApiRequest";


const Profile = (props) => {
    const {user, userPosts} = useContext(GlobalContext);

    const [profileUser, setProfileUser] = useState({});
    const owner = props.match.params.id ? user.state._id === props.match.params.id : true;
    const editProfileClick = () => props.history.push('/edit-profile');
    const {apiRequest, isLoading} = useApiRequest();

    useEffect(() => {
        if (props.match.params.id) {
            const userId = props.match.params.id;
            apiRequest(
                {options: {method: 'get', path: `/users/user/${userId}`}},
                (res, error) => {
                    if (error) console.log(error);
                    if (res) {
                        setProfileUser(res.data.data)
                    }
                }
            );
        } else {
            setProfileUser(user.state);
        }
    }, [props.match.params.id, user.state]);

    useEffect(() => {
        //load user posts
        if (profileUser && profileUser._id) {
            apiRequest({
                options: {method: 'get', path: `/posts/user/${profileUser._id}`},
                onSuccess: {dispatch: userPosts.dispatch, action: SET_POSTS}
            });
        }
    }, [profileUser]);

    return (
        <div>
            <div className='row'>
                <div className='col-12'>
                    <div className='profile-bg'>
                        <img src={profileUser.avatar} alt='user-avatar'
                             className='profile-avatar mt-auto'/>
                        <h1>{profileUser.name}</h1>
                        <h4 className='mt-2 badge-pill badge-success mb-auto'>{profileUser.username}</h4>
                        {owner ? (<button className='mb-3 ml-auto mt-auto mr-3 btn btn-secondary pt-2 pl-3 pr-3'
                                          onClick={editProfileClick}>edit</button>) : null}
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <div className='mt-4'>
                        <div className='d-flex mt-5'>
                            <h3 className='text-muted'>Posts</h3>
                            {owner ? (<button className='btn btn-outline-success ml-auto'
                                              onClick={() => props.history.push('/create-post')}>Create A Post
                            </button>) : null}
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            {userPosts.state.map(post => (
                                <Post key={post._id} data={post} currentUser={user.state}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Profile);

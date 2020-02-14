import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import axios from 'axios'
import {API_URL} from "../../../constants";
import CreateComment from "../Comment/CreateComment";
import Comment from "../Comment/Comment";
import getLastUpdated from "../../../util/getLastUpdated";
import EditContent from "./EditContent";
import Spinner from "../Spinner/Spinner";

const Post = (props) => {

    //local state
    const [state, setState] = useState(props.data);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(props.singlePost);
    const [editing, setEditing] = useState(false);

    const [isLikeLoading, setLikeLoading] = useState(false);

    //load comments
    useEffect(() => {
        axios.get(`${API_URL}/comments/${state._id}`)
            .then(res => setComments(res.data.comments))
            .catch(err => console.log(err.data))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // check to see if user liked the post or not
    useEffect(() => {
        const likedUsers = state.likes.map(l => l.user);
        setLiked(likedUsers.includes(props.currentUser._id));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.likes]);

    const toggleLike = (e) => {
        setLikeLoading(true);
        if (!liked) {
            axios.post(`${API_URL}/posts/like/${state._id}`, {})
                .then(res => {
                    setState({...state, likes: res.data.likes});
                    setLikeLoading(false);
                })
                .catch(err => {
                    console.log(err.data);
                    setLikeLoading(false);
                })
        } else {
            axios.post(`${API_URL}/posts/unlike/${state._id}`, {})
                .then(res => {
                    setState({...state, likes: res.data.likes});
                    setLikeLoading(false);
                })
                .catch(err => {
                    console.log(err.data);
                    setLikeLoading(false);
                })
        }
    };

    const toggleEdit = () => setEditing(!editing);

    const viewProfile = () => {
        props.history.push('/profile/' + state.user._id);
    };

    const CommentsContainer = () => {
        return (
            <div>
                <div className='row mt-3'>
                    <CreateComment  post={state._id} setState={setComments}/>
                </div>
                <div className='row mt-3'>
                    {comments.reverse().map(comment => (
                        <Comment key={comment._id} comment={comment} state={{comments, setComments}}/>
                    ))}
                </div>
            </div>
        )
    };

    return (
        <div className="post card">
            <div className="card-body d-flex flex-column">
                <div className='d-flex align-items-center '>
                    <img className='user-avatar mb-3 clickable' onClick={viewProfile} src={state.user.avatar}
                         alt='user-avatar'/>
                    <h4 className="ml-2 clickable" onClick={viewProfile}>{state.user.name}</h4>
                    {props.editable ? (<button className='btn btn-outline-secondary ml-auto'
                                               onClick={toggleEdit}>edit</button>) : null}
                </div>
                {state.image ? (<img src={state.image} alt='' className='post-image clickable'
                                     onClick={() => !props.singlePost ? props.history.push(`/post/${state._id}`) : null}/>) : null}
                <div className='ml-3 mr-3 mt-auto d-flex flex-column'>
                    <div className='row mt-4 mb-3'>
                        {editing ? <EditContent data={{state, setState}} toggle={toggleEdit}/> : state.content}
                    </div>
                    <div className='row'>
                        <button className={classnames('btn mr-2', {'btn-outline-info': !liked}, {'btn-info': liked})}
                                onClick={toggleLike} disabled={isLikeLoading}
                        >Likes ({state.likes.length}) {isLikeLoading && <Spinner/>}
                        </button>
                        <button className='btn btn-outline-info' onClick={() => setShowComments(!showComments)}>Comments
                            ({comments.length})
                        </button>
                        <p className="card-text ml-auto"><small
                            className="text-muted">{`Last Updated${getLastUpdated(state.last_update)}`}</small></p>
                    </div>
                    {showComments ? (<CommentsContainer/>) : null}
                </div>
            </div>
        </div>
    )
};

export default withRouter(Post);

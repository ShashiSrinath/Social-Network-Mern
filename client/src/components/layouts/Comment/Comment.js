import React, {useContext, useState} from 'react';
import {API_URL} from "../../../constants";
import getLastUpdated from "../../../util/getLastUpdated";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {GlobalContext} from "../../../context/GlobalState";
import CenterSpinner from "../Spinner/CenterSpinner";
import Spinner from "../Spinner/Spinner";

const Comment = (props) => {
    const {_id, user, content, created_date} = props.comment;
    const {user: {state: loggedInUser}} = useContext(GlobalContext);

    const [state, setState] = useState(content);
    const editable = user._id.toString() === loggedInUser._id.toString();
    const [edit, setEdit] = useState(false);
    const [commentText, setCommentText] = useState(content);
    const [isLoading, setLoading] = useState(false);

    const viewProfile = () => {
        props.history.push('/profile/' + user._id);
    };

    const EditComment = () => {
        const onChangeHandle = e => {
            setCommentText(e.target.value);
        };

        const onDeleteHandle = (e) => {
            setLoading(true);
            axios.delete(`${API_URL}/comments/delete/${_id}`,)
                .then(res => {
                    const deletedCommentIndex = props.state.comments.map(comment => comment._id).indexOf(res.data.deletedComment._id);
                    const comments = props.state.comments.slice();
                    comments.splice(deletedCommentIndex, 1);
                    props.state.setComments(comments);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err.data);
                    setLoading(false);
                })
        };

        const onSubmitHandle = (e) => {
            e.preventDefault();

            const data = {
                content: commentText
            };
            setLoading(true);
            axios.put(`${API_URL}/comments/edit/${_id}`, data,)
                .then(res => {
                    console.log(res.data.comment);
                    setState(res.data.comment.content);

                    setCommentText(res.data.comment.content);
                    setEdit(false);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err.data);
                    setLoading(false);
                })
        };

        return (
            <div className="comment-form mb-3">
                <div className="card">
                    <div className="card-header bg-info text-white">
                        Edit Comment
                    </div>
                    <div className="card-body">
                        <div className='d-flex align-items-center'>
                            <img className='user-avatar mb-3' src={user.avatar} alt='user-avatar'/>
                            <h4 className="ml-2">{user.name}</h4>
                        </div>
                        <form onSubmit={onSubmitHandle}>
                            <div className='d-flex flex-column'>
                                <div className="form-group">
                                <textarea className="form-control form-control-lg" placeholder="Comment..."
                                          value={commentText} onChange={onChangeHandle}/>
                                </div>
                                {!isLoading ?
                                    <div className='d-flex'>
                                        <button type="button" className="btn btn-outline-danger ml-auto"
                                                onClick={onDeleteHandle}>Delete Comment
                                        </button>
                                        < button type="submit" className="btn btn-outline-success ml-auto">Edit Comment
                                        </button>
                                    </div> : <div className='d-flex justify-content-center'><Spinner/></div>}
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        )
    };

    return (
        <div className="comment-form mb-5">
            <div className='d-flex flex-column comment-container'>
                {editable ?
                    <div className='text-muted ml-auto mr-1 clickable' onClick={() => setEdit(!edit)}>edit</div> : null}
                {!edit ? (<div className='d-flex  justify-content-start align-items-center'>
                    <img className='user-avatar mb-3 clickable' onClick={viewProfile}
                         src={user.avatar} alt='user-avatar'/>
                    <p className="ml-3"><b className='clickable' onClick={viewProfile}>{user.name + ' - '}</b> {state}
                    </p>
                </div>) : EditComment()}
                <div className="blockquote-footer mt-2 ml-auto">{`added${getLastUpdated(created_date)}`}</div>
            </div>
        </div>
    )
};

export default withRouter(Comment);

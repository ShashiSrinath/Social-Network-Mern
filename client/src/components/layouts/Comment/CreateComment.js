import React, {useContext, useState} from 'react';
import {API_URL} from "../../../constants";
import axios from "axios";
import {GlobalContext} from "../../../context/GlobalState";
import Spinner from "../Spinner/Spinner";

const CreateComment = ({post , setState}) => {
    const {user: {state: user}} = useContext(GlobalContext);
    const [comment, setComment] = useState('');
    const [isLoading, setLoading] = useState(false);

    const onChangeHandle = e => {
        setComment(e.target.value);
    };

    const onSubmitHandle = e => {
        e.preventDefault();
        setLoading(true);
        const data = {
            content: comment
        };

        axios.post(`${API_URL}/comments/${post}`, data,)
            .then(res => {
                setComment('');
                setState(res.data.comments);
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
                    Add a Comment...
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
                                          value={comment} onChange={onChangeHandle}/>
                            </div>
                            <button type="submit" className="btn btn-outline-success ml-auto" disabled={isLoading}>Add Comment {isLoading && <Spinner />}</button>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    )
};

export default CreateComment;

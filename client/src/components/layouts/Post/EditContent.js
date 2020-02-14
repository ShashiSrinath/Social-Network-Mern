import React, {useState} from 'react';
import {withRouter} from 'react-router-dom'
import axios from "axios";
import {API_URL} from "../../../constants";
import ErrComponent from "../Error/ErrorComponent";

const EditContent = (props) => {
    const [content, setContent] = useState(props.data.state.content);
    const [errors, setErrors] = useState(undefined);

    const onChangeHandle = e => {
        setContent(e.target.value);
    };

    const onDeleteHandle = e => {
        axios.delete(`${API_URL}/posts/delete/${props.data.state._id}`)
            .then(res => {
                props.history.push('/feed');
            })
            .catch(err => {
                console.log(err.response.data);
                setErrors(err.response.data.message);
            })
    };

    const onSubmitHandle = e => {
        e.preventDefault();
        setErrors(undefined);

        const data = {
            content: content
        };

        axios.put(`${API_URL}/posts/update/${props.data.state._id}`, data)
            .then(res => {
                console.log(res.data.post);
                props.data.setState({...props.data.state, content: res.data.post.content});

                //hide edit dialog
                props.toggle();

            })
            .catch(err => {
                console.log(err.response.data);
                setErrors(err.response.data.message);
            })
    };

    return (
        <div className='d-flex w-100'>
            <div className='d-flex flex-column w-100'>
                {errors ? (<ErrComponent error={errors}/>) : null}

                <form className="mt-5 mb-5 w-100" onSubmit={onSubmitHandle}>
                    <div className="form-group">
                                <textarea className="form-control form-control-lg post-edit-text"
                                          placeholder="Say something..."
                                          value={content} onChange={onChangeHandle}/>
                    </div>
                    <div className='d-flex justify-content-around'>
                        <button type="submit" className="btn btn-outline-success mr-auto">Edit Post</button>
                        <button type="button" className="btn btn-outline-danger ml-auto" onClick={onDeleteHandle}>Delete
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default withRouter(EditContent);

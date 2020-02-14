import React, {useState} from 'react';
import axios from 'axios';
import {API_URL, SERVER_URL} from "../../../constants";
import {withRouter} from 'react-router-dom';
import ErrComponent from "../../layouts/Error/ErrorComponent";
import Spinner from "../../layouts/Spinner/Spinner";

const CreatePost = (props) => {

    const [content, setContent] = useState('');
    const [image, setImage] = useState({
        file: null,
        src: `https://res.cloudinary.com/social-network-profghost/image/upload/v1580360141/xkdfzneftq39dwtxzjvp.jpg`,
        uploaded: false,
        path: undefined
    });
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);


    const createPost = (post) => {
        axios.post(`${API_URL}/posts/create`, post)
            .then(res => {
                setLoading(false);
                props.history.push('/feed');
            })
            .catch(err => {
                setLoading(false);
                console.log(err.response.data.message);
                setErrors(err.response.data.message)
            })
    };

    const onImageChangeHandler = e => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                src: URL.createObjectURL(e.target.files[0]),
                uploaded: false,
                path: undefined
            });
        }
    };

    const onContentChangeHandler = e => {
        setContent(e.target.value);
    };

    const onSubmitHandler = async e => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        //handle image upload
        const data = new FormData();
        data.append('image', image.file);

        if (!image.uploaded) {
            //uploading image to server
            try {
                const res = await axios.post(`${API_URL}/upload`, data);
                if (res.data.file) {
                    setImage({
                        ...image,
                        uploaded: true,
                        path: res.data.file.image
                    });

                    //create post
                    const post = {
                        content,
                        image: res.data.file.image
                    };

                    createPost(post);
                } else {
                    setErrors([{message: 'you need to add a image first'}]);
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
                setErrors([err.response.data]);
                setLoading(false);
            }
        } else {
            //create post
            const post = {
                content,
                image: image.path
            };

            createPost(post);
        }
    };


    return (
        <div className='d-flex justify-content-center'>
            <div className='d-flex flex-column w-50'>
                <div className='mt-5 mb-5'>
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            Create a Post...
                        </div>
                        {errors ? errors.map(error => (
                            <ErrComponent key={errors.indexOf(error)} error={error.message}/>)) : null}
                        <div className="card-body">
                            <div className="col-md-6">
                                <form method="post" action="#" id="#">
                                    <div className="form-group files color">
                                        <input type="file" accept=".png,.jpeg,.jpg,.gif"
                                               onChange={onImageChangeHandler}/>
                                    </div>
                                </form>
                                <img src={image.src} className='post-image-thumb' alt={'post-header'}/>
                            </div>
                            <div className='d-flex flex-column mt-3'>
                                <div className="form-group">
                                <textarea className="form-control form-control-lg" placeholder="Say Something..."
                                          value={content} onChange={onContentChangeHandler}/>
                                </div>
                                <button className="btn btn-outline-primary" onClick={onSubmitHandler}
                                        disabled={isLoading}>Create Post {isLoading && <Spinner />}
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default withRouter(CreatePost);

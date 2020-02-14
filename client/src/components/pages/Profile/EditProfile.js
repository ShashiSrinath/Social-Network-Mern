import React, {useState,useEffect} from 'react';
import {withRouter} from "react-router-dom";
import {API_URL} from "../../../constants";
import axios from "axios";
import ErrComponent from "../../layouts/Error/ErrorComponent";

const EditProfile = (props) => {
    const [image, setImage] = useState({
        file: null,
        src: undefined,
        uploaded: false,
        path: undefined
    });

    const [state, setState] = useState({
        name: '',
        avatar: '',
        email: ''
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/users/`,)
            .then(res => {
                console.log(res);
                setState({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    avatar: res.data.user.avatar,
                });
            })
            .catch(err => console.log(err));
    }, []);


    const updateProfile = data => {
        axios.put(`${API_URL}/users/update`, data)
            .then(res => {
                props.history.push('/profile');
            })
            .catch(err => {
                console.log(err.response.data);
                setErrors(err.response.data.errors)
            })
    };

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value})
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

    const onSubmitHandler = async e => {
        e.preventDefault();
        setErrors([]);

        //handle image upload
        const data = new FormData();
        data.append('image', image.file);

        if (image.file) {
            console.log('uploading image')
            //uploading image to server
            try {
                const res = await axios.post(`${API_URL}/upload`, data);
                console.log(res.data.file.image)
                if (res.data.file.image) {
                    setImage({
                        ...image,
                        uploaded: true,
                        path: res.data.file.path
                    });

                    //update profile
                    const profile = {
                        name: state.name,
                        avatar: res.data.file.image,
                        email: state.email,
                    };

                    updateProfile(profile);
                } else {
                    setErrors('you need to add a image first')
                }
            } catch (err) {
                setErrors(err.response.data);
            }
        } else {
            //update profile
            const profile = {
                name: state.name,
                email: state.email,
            };

            updateProfile(profile);
        }
    };

    return (
        <section id="register" className="col-md-6 offset-md-3 mt-5">
            {/*{errors.map(error => (<ErrComponent key={errors.indexOf(error)} error={error}/>))}*/}
            <h2 className="mb-4">Edit Profile</h2>
            <form onSubmit={onSubmitHandler}>
                <div className='d-flex justify-content-center mt-5 mb-3'>
                    <div className='d-flex flex-column align-items-center'>
                        <img className='profile-avatar' alt='profile-avatar' src={image.src ? image.src: state.avatar}/>
                        <input type="file" id='image' accept=".png,.jpeg,.jpg,.gif" onChange={onImageChangeHandler} className='invisible'/>
                        <label htmlFor={'image'} className='btn btn-success'>Upload a Image </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input type="text" id="name" name="name" value={state.name} onChange={handleChange}
                           className="form-control form-control-lg" placeholder="Your Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={state.email} onChange={handleChange}
                           className="form-control form-control-lg" placeholder="example@example.com"/>
                </div>
                <button type="submit" className="btn btn-primary float-right">Update Profile</button>
            </form>
        </section>
    )
};

export default withRouter(EditProfile);

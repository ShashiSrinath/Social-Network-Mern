import React from 'react';

import './home.scss'
import Button from "../../layouts/Button/Button";

const Home = () => {
    return (
        <header className='landing'>
            <div className='landing__text-box'>
                <h1 className='landing__heading-primary'>
                    <span className='landing__heading-primary-main'>Social Network</span>
                    <span className='landing__heading-primary-sub'>Stay Connected With Your Loved Ones</span>
                </h1>

                <Button text='Register' to='/register' className='btn-primary landing__btn-register'/>
                <Button text='Login' to='/login' className='btn-success landing__btn-login'/>
            </div>
        </header>
    )
};

export default Home;
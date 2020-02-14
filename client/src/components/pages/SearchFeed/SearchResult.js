import React from 'react'
import {withRouter} from "react-router-dom";

const SearchResult = (props) => {

    const onClickHandler = () => props.history.push('/profile/'+props.data._id);

    return(
        <div className='d-flex justify-content-center mt-2 mb-2 clickable' onClick={onClickHandler}>
            <div className="card" style={{width: '50vw'}}>
                <div className="card-body" >
                    <div className='d-flex justify-content-center'>
                        <img className='profile-avatar' src={props.data.avatar} alt='user-avatar'/>
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                        <h2 className='card-title'>{props.data.name}</h2>
                        <h4 className='card-subtitle text-muted'>{props.data.username}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default withRouter(SearchResult);

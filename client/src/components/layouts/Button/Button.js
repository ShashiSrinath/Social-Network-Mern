import React from 'react';
import {Link} from 'react-router-dom'

import './button.scss'

const Button = (props) => {

    return (
        <Link to={props.to ? props.to : '#'} className={`btn ${props.className} `}
              onClick={props.onClick}>
            {props.text}
        </Link>
    )
};

export default Button;
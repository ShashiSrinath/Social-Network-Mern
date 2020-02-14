import React from 'react'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

const Spinner = ({size}) => {

    return(
        <span className='spinner text-muted'>
            <FontAwesomeIcon spin icon={faSpinner} size={size} />
        </span>
    )
};

export default Spinner;
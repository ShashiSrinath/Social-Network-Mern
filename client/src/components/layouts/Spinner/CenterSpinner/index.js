import React from 'react';
import Spinner from "../Spinner";

const CenterSpinner = ({size}) => {
    const styles = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%)'
    };

    return(
            <div style={styles}>
                <Spinner size={size}/>
            </div>
     );
};

export default CenterSpinner;
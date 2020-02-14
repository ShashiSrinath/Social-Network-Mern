import React from 'react';

const ErrComponent = (props) => (
    <div className='m-2'>
        <div className="alert alert-danger" role="alert">
            {props.error}
        </div>
    </div>
);

export default ErrComponent;

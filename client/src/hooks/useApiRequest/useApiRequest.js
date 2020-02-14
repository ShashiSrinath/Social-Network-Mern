import React, {useState} from 'react';
import axios from 'axios';
import {API_URL} from "../../constants";

const useApiRequest = () => {
    const [isLoading, setLoading] = useState(false);

    const apiRequest = async ({options, onSuccess, onError}, callback) => {
        const  {method, path} = options;
        const {dispatch, action} = onSuccess ? onSuccess : {};
        const {errorDispatch, errorAction} = onError ? onError : {};
        setLoading(true);
        try {
            const res = await axios[method](`${API_URL}${path}`);
            if (dispatch) {
                dispatch({
                    type: action,
                    response: res
                })
            }
            if (callback) callback(res);
            setLoading(false);
        } catch (e) {
            if (errorDispatch) {
                errorDispatch({
                    type: errorAction,
                    response: e
                });
            }
            if (callback) callback(undefined , e);
            setLoading(false);

        }
    };



    return {apiRequest ,isLoading};
};

export default useApiRequest;
import axios from "axios";

const set = (token) => {
    localStorage.setItem('jwt', token);
    axios.defaults.headers.common['Authorization'] = token;
};

const remove = () => {
    localStorage.removeItem('jwt');
    delete axios.defaults.headers.common['Authorization'];
};

export default {set , remove};
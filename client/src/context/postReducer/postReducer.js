import {SET_POSTS} from "./postActions";

export const initialPostState = [];

const postReducer = (state, {type, response}) => {
    switch (type) {
        case SET_POSTS:
            return response.data.posts;
        default:
            return state;
    }
};

export default postReducer;
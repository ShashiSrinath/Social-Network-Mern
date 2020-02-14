import React, {createContext, useReducer, useState} from "react";
import manageJWT from "../util/mangeJWT";
import postReducer, {initialPostState} from "./postReducer/postReducer";

export const GlobalContext = createContext({});

const GlobalState = (props) => {
    const [user, setUser] = useState( undefined);
    const [posts, postsDispatch] = useReducer(postReducer, initialPostState);
    const [userPosts, userPostsDispatch] = useReducer(postReducer, initialPostState);

    const logout = () => {
        setUser(null);
        manageJWT.remove();
    };

    return (
        <GlobalContext.Provider
            value={{
                user: {state: user, setState: setUser , logout},
                userPosts: {state:userPosts, dispatch: userPostsDispatch},
                posts: {state:posts, dispatch: postsDispatch}
            }}
            children={props.children}/>
    )
};

export default GlobalState;
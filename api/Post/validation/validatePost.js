module.exports = ({content,image}) => {
    let errors = [];
    if(!content || content.length === 0) {
        errors.push({
            type: 'content',
            message: 'content cannot be empty' });
    }
    if(!image || image.length === 0) {
        errors.push({
            type: 'image',
            message: 'you need a image to create a post' });
    }

    return {
        errors,
        notValid: Boolean(errors.length),
    }

};

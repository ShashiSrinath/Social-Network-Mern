module.exports = ({content}) => {
    let errors = [];
    if(!content || content.length === 0) {
        errors.push({
            type: 'comment',
            message: 'comment cannot be empty' });
    }
    return {
        errors,
        notValid: Boolean(errors.length),
    }

};

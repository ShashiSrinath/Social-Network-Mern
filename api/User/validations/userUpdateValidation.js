module.exports = ({name, email}) => {
    let errors = [];
    if (!email || email ==='') {
        errors.push({ message: 'Please enter your email' });
    }

    if (!name || name==='') {
        errors.push({ message: 'Please enter your password' });
    }

    return {
        errors,
        notValid: Boolean(errors.length),
    }
};

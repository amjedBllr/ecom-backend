const restrict = (...role) => {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            const userRole = req.user.role;
            console.log(userRole)
            if (!role.includes(userRole)){
                return res.status(401).json({ message: 'Access denied !!', error: `user is not authorized to access this route !!` });
            } else {
                next();
            }
        } else {
            return res.status(401).json({ message: 'Access denied !!', error: 'User is not authenticated !!' });
        }
    };
};

module.exports = restrict;

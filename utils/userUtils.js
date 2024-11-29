async function verifyId(req, res, next) {
    req.user = req.params;
    next();
    
}

function checkRoles(roles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: "Permission denied" });
        }
    };
}

module.exports = {
    checkRoles, verifyId
}
const jwt = require('jsonwebtoken');
// Generate JWT
function generateToken(id,  role) {
    let payload = { id: id, role: role };
    const token = jwt.sign(payload,
        // @ts-ignore
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
        });
    return token;
}
async function verifyToken(req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    token = token.split(" ")[1];
    // @ts-ignore
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Failed to authenticate token" });
        }
        req.user = decoded;
        next();
    });
}


module.exports = { generateToken, verifyToken };
const jwt = require("jsonwebtoken");

 const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers['Authorization']

        if(!token) {
            return res.status(403).send("Access Denied")
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft()
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // req.user = verified.id
        req.user = verified
        next()
    } catch (error) {
        res.status(500).json({ error: error.message})
        console.log(error);
    }
}

module.exports = verifyToken
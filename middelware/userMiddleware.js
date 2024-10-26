const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_TOKEN;


const userMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log(token, JWT_SECRET);
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    else {
        try {
            const data = jwt.verify(token, JWT_SECRET);
            console.log(data)
            req.user = data;
            next();
        } catch (error) {
            res.status(401).send({ error: "Please authenticate using a valid token" });
        }
    }
}

module.exports = userMiddleware;
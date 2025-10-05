import dotenv from 'dotenv'
dotenv.config();
import jwt from 'jsonwebtoken'
const jwtKey = process.env.JWT_KEY
console.log('jwtKey is' , jwtKey)
const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
        token = token.split(' ')[1];  // Bearer <token>
        jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                return res.status(401).send({ result:'Invalid token or token is expired' });
            } else {
                req.user = decoded; /// set the payload in req object
                next();
            }
        });
    } else {
        return res.status(403).send({ result: 'Please send token' });
    }
};

export default verifyToken;


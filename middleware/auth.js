// require("dotenv").config();
// const userSchema = require("../Schema/userSchema");
// const jwt = require("jsonwebtoken");

// const authMiddleware = async (req, res, next) => {
//   let token
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//        token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.TOKEN);
//       const user = await userSchema.findOne({ _id: decoded.id });
//       req.user = user;
//       next();
//     } catch (error) {
//       res.json({ error: error.message });
//     }
//   }
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    console.log(req.headers)
    if(!req.headers.authorization) return res.status(403).json({msg: "Not authorized. No token"})

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.TOKEN, (err, data) => {
            if(err) return res.status(403).json({msg: "Wrong or expired token"})
            else {
                req.user = data // an object with the user id as its only property -> data = {id: .....}
                next()
            }
        })
    }
}

module.exports = verifyToken
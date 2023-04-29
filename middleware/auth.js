const jwt= require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    // the token is in cookies
    if(req.cookies.token){
        token = req.cookies.token;
    }
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     token = req.headers.authorization.split(' ')[1];
    // }

    //Make sure token exists
    if(!token || token === 'null'){
        return res.status(401).json({success:false, error:"1Not authorized to access this route"});
    }

    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        console.log(err.stack)
        return res.status(401).json({success:false, error:"2Not authorized to access this route"});
    }
}

//Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false, error:`User role ${req.user.role} is not authorized to access this route`});
        }
        next();
    }
}

// restrict access to admin or a specific user
exports.restrictTo = (selected_identity) => {
    return (req, res, next) => {
        if (selected_identity == "u_id"){
            identity = req.user._id
        } else {
            error = new Error("Invalid identity")
            console.log(error.stack)
        }
        if (req.user.role !== 'admin' && req.params.u_id != identity) {
            return res.status(403).json(
                {success:false, error:`User ${req.user._id} with role ${req.user.role} is not authorized to access this route`});
        }
        next();
    }
}
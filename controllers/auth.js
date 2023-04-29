const User = require("../models/User.js");

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    // let passwordError = [];
    // // validate password
    // if (password.length < 8) {
    //     passwordError.push("Password must be at least 8 characters");
    // }
    // if (password.length > 16){
    //     passwordError.push("Password must be less than 16 characters");
    // }
    // if (password.search(/[A-Z]/i) < 0) {
    //     passwordError.push("Password must contain at least one uppercase.");
    // }
    // if (password.search(/[a-z]/i) < 0) {
    //     passwordError.push("Password must contain at least one lowercase.");
    // }
    // if (password.search(/[0-9]/) < 0) {
    //     passwordError.push("Password must contain at least one digit.");
    // }
    // // return if password is invalid
    // if (passwordError.length > 0) {
    //     return res.status(400).json({ success: false, error: passwordError });
    // }

    // check if email already exists
    

    //Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    //Create token
    const token = user.getSignedJwtToken();

        //Send token in cookie
        // res.cookie('token', token, {
        //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        //     httpOnly : true,
        //     secure : false
        // });
        res.User = user;
        res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  try {
    // find user
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }


    //Check if password matches
    const isMatch = await user.matchPassword(req.body.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false, error: "Invalid credentials" });
  }
};

//@desc logout user
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

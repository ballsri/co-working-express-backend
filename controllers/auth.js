const User = require("../models/User.js");

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
// exports.register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;

//     //Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//     });

//     sendTokenResponse(user, 200, res);
//   } catch (err) {
//     res.status(400).json({ success: false });
//     console.log(err.stack);
//   }
// };

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

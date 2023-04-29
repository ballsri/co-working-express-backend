// const User = require("../models/User.js");

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


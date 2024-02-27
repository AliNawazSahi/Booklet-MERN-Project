const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const Fetchuser = require('../middleware/Fetchuser')

const { body, validationResult } = require('express-validator');
const router = express.Router();


const JWT_SECRET = "aliahsansahi@twindevops"

//Route:1 Create a User using : Post "/api/auth/createuser" . NO login required!!
router.post('/createuser', [
  //validation checks
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
  // If there are errors send bad request
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  //check wheather user with this email already exists
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success,error: "Sorry with this email user already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secpassword = await bcrypt.hash(req.body.password, salt)
    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpassword,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    success = true
    const authToken = jwt.sign(data, JWT_SECRET)

    res.json({ success,authToken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
})


// Route:2 Authenticate a User using : Post "/api/auth/login" . NO login required!!
router.post('/login', [
  //validation checks
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({success , error: "Please try to login with correct credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET)
     success = true
    res.json({success , authToken })

  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
}

)

// Route:3 Get loggedin User details  using : Post "/api/auth/getuser" . login required!!
router.post('/getuser', Fetchuser, async (req, res) => {

  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password");
    res.send(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
})

module.exports = router;
const userSchema = require("../Schema/userSchema");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");

module.exports = {
  createANewUser: async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await userSchema.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    const user = await userSchema.create({
      name,
      email,
      password,
    });
  
    if (user) {
      generateToken(res, user._id);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
  
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
    // try {
    //   const { email, password } = req.body;
    //   const user = await userSchema.findOne({ email: email });
    //   // if (!user) return res.json({ error: "User not found" });
    //   const checkPassword = await bcrypt.compare(password, user.password);
    //   if (checkPassword) {
    //   generateToken(res, user._id);
    //   res.json({
    //     _id: user._id,
    //     userName: user.userName,
    //     email: user.email,
    //   });
    // }else {
    //     res.json({ error: "Invalid password" });
    //   }
      //   const token = await generateToken({ id: user._id, email: email });
      //   const userObject = {
      //     _id: user._id,
      //     userName: user.userName,
      //     email: user.email,
      //     createdAt: user.createdAt,
      //     about: user.about,
      //     reputation: user.reputation,
      //   };

      //   res.json({ status: true, token: token, userObject: userObject });
      // } else {
      //   res.json({ error: "Invalid password" });
      // }
    // } catch (error) {
    //   res.json({ error: error.message });
    // }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userSchema.find()
      res.json({ users: users });
    } catch (error) {
      res.json({ error: error.message });
    }
  },
  getuserProfile:async(req,res)=>{
    const user = await userSchema.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await userSchema.findById(id);

      const user = {
        _id: data._id,
        userName: data.userName,
        reputation: data.reputation,
        createdAt: data.createdAt,
        about: data.about,
      };

      res.json({ userData: user });
    } catch (error) {
      res.json({ error: error.message });
    }
  },

  searchUser: async (req, res) => {
    try {
      const { search } = req.query;
      const data = await userSchema.find({
        userName: { $regex: `${search}`, $options: "i" },
      });
      res.json({ users: data });
    } catch (error) {
      res.json({ error: error.message });
    }
  },logout:async (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  },
  edit: async (req, res) => {
    try {
      const userObj = {
        userName: req.body.userName,
        about: req.body.about,
        email: req.body.email,
      };
      const data = await userSchema.updateOne(
        { _id: req.params.id },
        {
          $set: {
            email: userObj.email,
            about: req.body.about,
            userName: req.body.userName,
          },
        }
      );
      const user = await userSchema.findById(req.params.id);
      const userObject = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        createdAt: user.createdAt,
        about: user.about,
        reputation: user.reputation,
      };
    
      res.json({ data: userObject, edited: true });
    } catch (error) {
      res.json({ error: error.message });
    }
  },
 
};

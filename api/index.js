const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://ugurkurkcu:ugurkurkcu@cluster0.p4dgbxy.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

const User = require("./models/user");
const Post = require("./models/post");
const { request } = require("http");

//! endpoint to register a user in the backend

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    // check if the email is already exist

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    // create a new User

    const newUser = new User({
      name,
      email,
      password,
      profileImage,
    });

    // generate the verification token

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // save the user to db

    await newUser.save();

    // send the verification email to the registered user

    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(202).json({
      message:
        "Registration successful. Please check your email for verification",
    });

    //
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration Faild" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ugurkurkcu87@gmail.com",
      pass: "wlfm krar jmwq htyl",
    },
  });

  const mailOptions = {
    from: "needahand@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link  to verify your email : http://localhost:8000/verify/${verificationToken}`,
  };

  // send the mail

  try {
    await transporter.sendMail(mailOptions);

    console.log("Verification email has been sent successfully");
  } catch (error) {
    console.log("Error occurd while sending the verification email", error);
  }
};

//! endpoint to verify email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }
    // mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//! endpoint to login a user in the backend

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// user's profile

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    const loggedInUser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );

    if (!loggedInUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const connectedUsersIds = loggedInUser.connections.map(
      (connection) => connection._id
    );

    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUsersIds },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users");
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// send a connection request

app.post("/connection-request", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { connectionRequests: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentConnectionRequests: selectedUserId },
    });

    res.status(200);
  } catch (error) {
    res.status(500).json({ message: "Error creating connection request" });
  }
});

//! endpoint to show all the connections requests

app.get("/connection-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("connectionRequests", "name email profileImage")
      .lean();

    const connectionRequests = user.connectionRequests;

    res.json(connectionRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//! endpoint to show all the connections requests

app.post("/connection-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.connections.push(recepientId);
    recepient.connections.push(senderId);

    recepient.connectionRequests = recepient.connectionRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentConnectionRequests = sender.sentConnectionRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend request acccepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//! endpoint to fetch all the connections requests

app.get("/connections/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate("connections", "name profileImage createdAt")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    res.status(200).json({ connections: user.connections });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching the connections" });
  }
});

//! endpoint to create a post

app.post("/create", async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;
    const newPost = new Post({
      description: description,
      imageUrl: imageUrl,
      user: userId,
    });
    console.log(newPost);
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error creating the post" });
  }
});

//! endpoint to fetch all the post

app.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching all the posts" });
  }
});

//! endpoint to like a post

app.post("/like/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    // if the user already liked
    const existingLike = post?.likes.find(
      (like) => like.user.toString() === userId
    );

    if (existingLike) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    } else {
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({ message: "Post liked/unlike successfully", post });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error liking the post" });
  }
});

//! endpoint to update user description
app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userDescription } = req.body;

    await User.findByIdAndUpdate(userId, { userDescription });

    res.status(200).json({ message: "User profile successfully updated" });
  } catch (error) {
    console.log("error", error);
    res.status(500), json({ message: "Error updating user profile" });
  }
});

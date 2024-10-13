require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  try {
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      return res.json({
        error: true,
        message: "User already exists",
      });
    }

    const user = new User({
      fullName,
      email,
      password,
    });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registered",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Fetch the user information from the database
    const userInfo = await User.findOne({ email: email });

    // If no user is found, return an error
    if (!userInfo) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if password matches
    if (userInfo.password === password) {
      // Create the JWT token
      const accessToken = jwt.sign(
        { userId: userInfo._id }, // Include only necessary info
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10h" } // Expires in 10 hours
      );

      // Respond with user data and token
      return res.json({
        error: false,
        user: { id: userInfo._id, email: userInfo.email },
        accessToken,
        message: "Login success",
      });
    } else {
      // If password doesn't match, return error
      return res.status(400).json({
        error: true,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    // Catch any errors that occur and send a server error response
    return res.status(500).json({
      error: true,
      message: "Server error. Please try again later.",
    });
  }
});

// add
app.post("/add-note", authenticateToken, async (req, res) => {
  console.log("Request body:", req.body);
  const { title, content, tags } = req.body;

  // Adjust how you access the user object from the token
  const userId = req?.user?.userId;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: userId, // Now correctly accessing the user._id
    });
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      err: true,
      message: "Internal server error",
    });
  }
});
// EDit
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId; // Correctly accessing params from req
  const { title, content, tags, isPinned } = req.body;

  const { user } = req.user.userId;

  if (!title && !tags && !content) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    if (tags) {
      note.tags = tags;
    }
    if (isPinned !== undefined) {
      note.isPinned = isPinned;
    }
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      err: true,
      message: "Internal server error",
    });
  }
});

// get all Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  // Correctly extract user._id from the nested structure
  // const {
  //   user: {
  //     user: { _id },
  //   },
  // } = req.user;
  const userId = req?.user?.userId;
  console.log(req.user);
  try {
    // Await the Note.find() query and sort by 'isPinned'
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All Notes Received Successfully",
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});
// DELETE
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  // Extract noteId from the route params
  const { noteId } = req.params;

  // Extract userId from the nested structure
  // const {
  //   user: {
  //     user: { _id: userId },
  //   },
  // } = req.user;
  console.log(req?.params.noteId);
  console.log(req?.user?.userId);
  const userId = req?.user?.userId;

  try {
    // Find the note and ensure it belongs to the authenticated user
    const note = await Note.findOneAndDelete({
      _id: req?.params.noteId,
      userId: userId, // Ensure the user owns the note
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found or user not authorized",
      });
    }

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

// Pinned
app.put("/pin-note/:noteId", authenticateToken, async (req, res) => {
  // Extract noteId from the route params
  const { noteId } = req.params.noteId;
  console.log(req.params.noteId);
  // Extract userId from the nested structure
  const userId = req?.user?.userId;
  console.log(req?.user?.userId);

  try {
    // Find the note that belongs to the user
    const note = await Note.findOne({
      _id: req?.params.noteId,
      userId: userId,
    });
    console.log(note);
    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found or user not authorized",
      });
    }

    // Toggle the isPinned status
    note.isPinned = !note.isPinned;
    await note.save();

    return res.json({
      error: false,
      note,
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});
// get-users

app.get("/get-users", authenticateToken, async (req, res) => {
  try {
    // Extract user from token safely
    console.log(req?.user);
    const userId = req?.user?.userId;

    if (!userId) {
      return res.status(400).json({
        error: true,
        message: "User not found in the token",
      });
    }

    // Fetch all users from the database (excluding passwords)
    const users = await User.find().select("-password");

    return res.json({
      error: false,
      users,
      message: "All users retrieved successfully",
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
  // Extract userId from the request
  const userId = req?.user?.userId;
  console.log("User ID:", userId);

  // Get search query from query parameters
  const { query } = req.query; // e.g., /search-notes?query=someText

  try {
    // Find notes that belong to the user and match the search query
    const notes = await Note.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    // Return found notes or a message if none found
    return res.json({
      error: false,
      notes,
      message: notes.length
        ? "Notes found"
        : "No notes found matching your search",
    });
  } catch (err) {
    console.error("Error stack:", err.stack); // Log full error stack
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;

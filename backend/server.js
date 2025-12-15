const express = require("express");
const pool = require("./database")
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const app = express();
const port = 3000;
const JWT_SECRET = "9526a3614245f0a89de03a7b8ed8f893";


/* ---------- Middleware ---------- */
app.use(cors({origin: 'http://localhost:8080', credentials: true}));
app.use(express.json());
app.use(cookieParser())

const maxAge = 60 * 60

const generateJWT = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge })
}

app.get("/auth/check", (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.json({ authenticated: false });

    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch {
    res.json({ authenticated: false });
  }
});

/* ---------- Signup ---------- */
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashed]
    );

    const token = generateJWT(result.rows[0].id);

    res
      .cookie("jwt", token, { httpOnly: true })
      .status(201)
      .json({ user_id: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------- Login ---------- */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "User not found" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ error: "Invalid password" });

    const token = generateJWT(user.id);

    res
      .cookie("jwt", token, { httpOnly: true })
      .json({ user_id: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------- Logout ---------- */
app.post("/auth/logout", (req, res) => {
  res.clearCookie("jwt").json({ message: "Logged out" });
});

/* ---------- Server ---------- */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY date DESC");
    res.json({ posts: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { body, date } = req.body;

    if (!body || !date) {
      return res.status(400).json({ error: "Missing body or date" });
    }

    // Example: save post in a "posts" table (assuming you have one)
    const result = await pool.query(
      "INSERT INTO posts (body, date) VALUES ($1, $2) RETURNING *",
      [body, date]
    );

    res.status(201).json({ post: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Post not found" });

    res.json({ post: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post by ID
app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    const result = await pool.query(
      "UPDATE posts SET body = $1 WHERE id = $2 RETURNING *",
      [body, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Post not found" });

    res.json({ post: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Post not found" });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all posts
app.delete("/posts", async (req, res) => {
  try {
    await pool.query("DELETE FROM posts"); // remove all posts
    res.json({ message: "All posts deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

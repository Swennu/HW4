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

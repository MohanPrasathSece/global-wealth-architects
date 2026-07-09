const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join("/tmp", "database.json");
const UPLOAD_DIR = path.join("/tmp", "uploads");

// Ensure directories and files exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const initDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], enquiries: [] }, null, 2));
  }
};
initDb();

const readDb = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { users: [], enquiries: [] };
  }
};

const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically under /api/uploads
app.use("/api/uploads", express.static(UPLOAD_DIR));

// Configure multer for file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Handlers
app.post("/api/signup", (req, res) => {
  const { name, email, phone, countryCode } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDb();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email already exists", code: "ALREADY_EXISTS" });
  }

  const newUser = {
    name,
    email,
    phone,
    countryCode: countryCode || "CH",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({ success: true, user: newUser });
});

app.post("/api/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found. Please sign up first.", code: "NOT_FOUND" });
  }

  res.json({ success: true, user });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message, countryCode, fileUrl } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const db = readDb();
  const newEnquiry = {
    id: Date.now().toString(),
    name,
    email,
    phone: phone || "",
    countryCode: countryCode || "",
    message: message || "",
    fileUrl: fileUrl || null,
    createdAt: new Date().toISOString(),
  };

  db.enquiries.push(newEnquiry);
  writeDb(db);

  // If CRM API endpoint and token are configured, forward to external CRM!
  const crmUrl = process.env.CRM_API_URL;
  const token = process.env.CRM_AUTH_TOKEN || process.env.CRM_TOKEN || process.env.CRM_API_KEY;
  if (crmUrl && token) {
    const [first_name, ...lastNameParts] = (name || "Unknown").trim().split(" ");
    const last_name = lastNameParts.join(" ") || "Lead";

    const payload = {
      country_name: (countryCode || "ch").toLowerCase(),
      description: message || "Signup Lead",
      phone: phone || "",
      email: email.toLowerCase().trim(),
      first_name,
      last_name,
      custom_fields: {
        Source_ID: "website",
        How_Much_Invested: "0",
        Outline_Your_Case: message || "",
        file_url: fileUrl || ""
      }
    };

    console.log(`Forwarding lead to CRM endpoint: ${crmUrl}`);
    fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }).then(async response => {
      const text = await response.text();
      console.log(`CRM response status ${response.status}: ${text}`);
    }).catch(err => {
      console.error("External CRM forwarding failed:", err);
    });
  }

  res.json({ success: true, enquiry: newEnquiry });
});

// File Upload Handler (Blob Storage)
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  res.json({ success: true, fileUrl });
});

// Serve static frontend files (Vite build output) in production for local running
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Express server running locally on http://localhost:${PORT}`);
  });
}

module.exports = app;

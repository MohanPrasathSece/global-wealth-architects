import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { put, list } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = path.join("/tmp", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Memory database fallbacks for local development
let localUsers = [];
let localCount = 0;
const LOCAL_USERS_FILE = path.join(process.cwd(), "database.json");

if (fs.existsSync(LOCAL_USERS_FILE)) {
  try {
    const rawData = fs.readFileSync(LOCAL_USERS_FILE, "utf8");
    const json = JSON.parse(rawData);
    localUsers = json.users || [];
    localCount = json.count || 0;
  } catch (err) {
    console.warn("Could not read local users cache file, starting fresh:", err.message);
  }
}

// Vercel Blob helper functions
async function getBlobUrl(token) {
  try {
    const { blobs } = await list({ token });
    const userBlob = blobs.find((b) => b.pathname === "users.json");
    return userBlob ? (userBlob.downloadUrl || userBlob.url) : null;
  } catch (e) {
    console.error("Vercel Blob list error:", e);
    return null;
  }
}

async function getUsers() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return localUsers;
  }
  try {
    const blobUrl = await getBlobUrl(token);
    if (!blobUrl) {
      return localUsers;
    }
    const cacheBustedUrl = blobUrl.includes("?")
      ? `${blobUrl}&t=${Date.now()}`
      : `${blobUrl}?t=${Date.now()}`;
    const response = await fetch(cacheBustedUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      console.warn(`Fetch users from Blob failed: ${response.status}. Falling back to local.`);
      return localUsers;
    }
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch users from Vercel Blob, falling back to local:", e);
    return localUsers;
  }
}

async function saveUsers(usersList) {
  localUsers = usersList;
  try {
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify({ users: usersList, count: localCount }, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write users to local file:", e);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return;
  }

  try {
    await put("users.json", JSON.stringify(usersList, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControl: "no-store, no-cache, must-revalidate, max-age=0",
      token,
    });
  } catch (e) {
    console.error("Failed to put users to Vercel Blob:", e);
  }
}

const BLOB_KEY = "leads-count.json";

async function getLeadsCount() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return localCount;
  }
  try {
    const { blobs } = await list({ token });
    const countBlob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!countBlob) return 0;

    const res = await fetch(countBlob.url);
    if (!res.ok) return 0;
    const json = await res.json();
    return typeof json.count === "number" ? json.count : 0;
  } catch {
    return localCount;
  }
}

async function setLeadsCount(count) {
  localCount = count;
  try {
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify({ users: localUsers, count }, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write count to local file:", e);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return;
  }
  try {
    await put(BLOB_KEY, JSON.stringify({ count }), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token,
    });
  } catch (err) {
    console.error("Failed to put count to Vercel Blob:", err);
  }
}

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
app.post("/api/signup", async (req, res) => {
  const { name, email, phone, countryCode } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const users = await getUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
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

    users.push(newUser);
    await saveUsers(users);

    // Increment Leads Count on Signup
    const currentCount = await getLeadsCount();
    await setLeadsCount(currentCount + 1);

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("Signup handler error:", err);
    res.status(500).json({ error: "Signup failed due to server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const users = await getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "User not found. Please sign up first.", code: "NOT_FOUND" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Login handler error:", err);
    res.status(500).json({ error: "Login failed due to server error" });
  }
});

app.get("/api/leads-count", async (req, res) => {
  try {
    const count = await getLeadsCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to read count" });
  }
});

app.post("/api/leads-count", async (req, res) => {
  try {
    const current = await getLeadsCount();
    const next = current + 1;
    await setLeadsCount(next);
    res.json({ count: next });
  } catch (err) {
    res.status(500).json({ error: "Failed to set count" });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, countryCode, fileUrl } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

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

  // Increment count on contact form success
  try {
    const current = await getLeadsCount();
    await setLeadsCount(current + 1);
  } catch (err) {
    console.warn("Could not increment leads count in contact endpoint:", err.message);
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
  app.get("*any", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Express server running locally on http://localhost:${PORT}`);
  });
}

export default app;

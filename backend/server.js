// import express from "express";
// import cors from "cors";
// import pkg from "pg";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const { Pool } = pkg;

// // PostgreSQL Connection
// const pool = new Pool({
//   user: "postgres",        // your PostgreSQL username
//   host: "localhost",       // your PostgreSQL host
//   database: "postgres",    // your PostgreSQL database
//   password: "Adarsh12",    // your PostgreSQL password
//   port: 5432,
// });

// // Create table if not exists
// const createTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS basic_info (
//       id SERIAL PRIMARY KEY,
//       schemajson JSONB,
//       status VARCHAR(50),
//       createdat TIMESTAMP DEFAULT NOW()
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("✅ Table 'basic_info' is ready");
//   } catch (error) {
//     console.error("❌ Error creating table:", error);
//   }
// };
// createTable();

// // Insert form data
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;
//     await pool.query(
//       "INSERT INTO basic_info (schemajson, status) VALUES ($1, $2)",
//       [schemajson, status]
//     );
//     res.status(201).json({ message: "✅ Data saved successfully!" });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data" });
//   }
// });

// // Get all data
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM basic_info ORDER BY id DESC");
//     res.json(result.rows);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data" });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("🚀 Backend is running and connected to PostgreSQL");
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// import express from "express";
// import cors from "cors";
// import fs from "fs";
// import path from "path";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ===== File setup =====
// const CSV_FILE = path.join(process.cwd(), "basic_info.csv");

// // ===== Helper: Convert object to CSV line =====
// function objectToCSVLine(obj) {
//   const safeValue = (val) =>
//     `"${String(val).replace(/"/g, '""').replace(/\n/g, " ")}"`;
//   return Object.values(obj).map(safeValue).join(",") + "\n";
// }

// // ===== Helper: Write CSV Header if file doesn't exist =====
// function ensureCSVHeader() {
//   if (!fs.existsSync(CSV_FILE)) {
//     const header = "id,status,schemajson,createdat\n";
//     fs.writeFileSync(CSV_FILE, header);
//     console.log("✅ CSV file created with header");
//   }
// }

// // ===== Helper: Get the next incremental ID =====
// function getNextId() {
//   if (!fs.existsSync(CSV_FILE)) return 1; // file doesn’t exist yet

//   const csvData = fs.readFileSync(CSV_FILE, "utf-8").trim();
//   const lines = csvData.split("\n");

//   // If only header exists → next ID = 1
//   if (lines.length <= 1) return 1;

//   const lastLine = lines[lines.length - 1];
//   const lastId = parseInt(lastLine.split(",")[0].replace(/"/g, ""), 10);
//   return isNaN(lastId) ? 1 : lastId + 1;
// }

// // ===== POST: Save Data =====
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     ensureCSVHeader();

//     const nextId = getNextId();
//     const { status, ...schemajson } = req.body;

//     const data = {
//       id: nextId,
//       status: status || "draft",
//       schemajson: JSON.stringify(schemajson),
//       createdat: new Date().toISOString(),
//     };

//     const line = objectToCSVLine(data);
//     fs.appendFileSync(CSV_FILE, line);
//     console.log(`✅ Data appended to CSV (ID: ${nextId})`);

//     res.status(201).json({ message: `✅ Data saved successfully! ID: ${nextId}` });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data" });
//   }
// });

// // ===== GET: Retrieve All Data =====
// app.get("/api/basic-info", (req, res) => {
//   try {
//     ensureCSVHeader();
//     const csvData = fs.readFileSync(CSV_FILE, "utf-8").trim();

//     const [headerLine, ...lines] = csvData.split("\n");
//     const headers = headerLine.split(",");

//     const jsonData = lines.map((line) => {
//       const values = line
//         .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
//         .map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"'));
//       const obj = {};
//       headers.forEach((header, index) => {
//         obj[header] = values[index];
//       });
//       return obj;
//     });

//     res.json(jsonData.reverse()); // latest first
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data" });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend is running and saving data to CSV file with auto-increment ID");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT} (CSV Mode with Auto ID)`)
// );




// import express from "express";
// import cors from "cors";
// import sqlite3 from "sqlite3";
// import { open } from "sqlite";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Initialize and connect to SQLite database
// let db;
// const initializeDB = async () => {
//   db = await open({
//     filename: "./basic_info.db", // Database file
//     driver: sqlite3.Database,
//   });

//   // ✅ Create table if not exists
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS basic_info (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       schemajson TEXT,
//       status TEXT,
//       createdat DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

//   console.log("✅ SQLite Database ready at ./basic_info.db");
// };

// // ✅ POST route to insert data
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;
//     const jsonString = JSON.stringify(schemajson);

//     await db.run(
//       `INSERT INTO basic_info (schemajson, status) VALUES (?, ?)`,
//       [jsonString, status]
//     );

//     res.status(201).json({ message: "✅ Data saved successfully!" });
//   } catch (error) {
//     console.error("❌ Error inserting data:", error);
//     res.status(500).json({ message: "Error saving data" });
//   }
// });

// // ✅ GET route to fetch all data
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     const rows = await db.all(`SELECT * FROM basic_info ORDER BY id DESC`);
//     const formattedRows = rows.map(row => ({
//       ...row,
//       schemajson: JSON.parse(row.schemajson),
//     }));
//     res.json(formattedRows);
//   } catch (error) {
//     console.error("❌ Error fetching data:", error);
//     res.status(500).json({ message: "Error retrieving data" });
//   }
// });

// // ✅ Root endpoint
// app.get("/", (req, res) => {
//   res.send("🚀 SQLite Server is running and connected!");
// });

// // ✅ Start Server
// const PORT = 5000;
// initializeDB().then(() => {
//   app.listen(PORT, () =>
//     console.log(`🚀 Server running on http://localhost:${PORT}`)
//   );
// });









//npm install firebase-admin  THIS IS WORKING CODE FOR FIREBASE BACKEND



// import express from "express";
// import cors from "cors";
// import admin from "firebase-admin";
// import fs from "fs";
// import path from "path";

// // ====== Express Setup ======
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====== Firebase Setup ======
// const serviceAccountPath = path.resolve(
//   "./basic-info-api-firebase-adminsdk-fbsvc-62dfb93770.json"
// );

// // Read the Firebase Admin SDK key
// const serviceAccount = JSON.parse(
//   fs.readFileSync(serviceAccountPath, "utf8")
// );

// // Initialize Firebase Admin
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();
// const collectionName = "basic_info"; // Firestore collection name

// console.log("✅ Firebase connected successfully");

// // ===== Helper: Get current timestamp =====
// const getTimestamp = () => new Date().toISOString();

// // ===== POST: Save Data =====
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;

//     const data = {
//       status: status || "draft",
//       schemajson,
//       createdAt: getTimestamp(),
//     };

//     const docRef = await db.collection(collectionName).add(data);
//     console.log(`✅ Data added to Firestore with ID: ${docRef.id}`);

//     res.status(201).json({
//       message: "✅ Data saved successfully!",
//       id: docRef.id,
//     });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data", error });
//   }
// });

// // ===== GET: Retrieve All Data =====
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     const snapshot = await db
//       .collection(collectionName)
//       .orderBy("createdAt", "desc")
//       .get();

//     const data = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend connected to Firebase Firestore successfully!");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} (Firestore Mode)`);
// });





//npm install csv-writer run this command to install csv-writer package for store data in csv file
//THIS IS WORKING CODE FOR CSV BACKEND


// import express from "express";
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import { createObjectCsvWriter } from "csv-writer";

// // ====== Express Setup ======
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====== CSV File Path ======
// const dataDir = path.resolve("./data");
// const csvFilePath = path.join(dataDir, "basic_info.csv");

// // Ensure data directory exists
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir);
//   console.log("📁 Created data directory");
// }

// // ====== Helper: Timestamp ======
// const getTimestamp = () => new Date().toISOString();

// // ====== Helper: Create CSV Writer ======
// const getCsvWriter = (append = true) => {
//   return createObjectCsvWriter({
//     path: csvFilePath,
//     header: [
//       { id: "id", title: "ID" },
//       { id: "status", title: "Status" },
//       { id: "timestamp", title: "Timestamp" },
//       { id: "schemajson", title: "SchemaJSON" },
//     ],
//     append,
//   });
// };

// // ====== POST: Save Data ======
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;

//     const data = {
//       id: Date.now().toString(), // unique ID
//       status: status || "draft",
//       timestamp: getTimestamp(),
//       schemajson: JSON.stringify(schemajson),
//     };

//     // Check if CSV exists — create header if not
//     const fileExists = fs.existsSync(csvFilePath);
//     const csvWriter = getCsvWriter(fileExists);

//     await csvWriter.writeRecords([data]);
//     console.log(`✅ Data saved to CSV file: ${csvFilePath}`);

//     res.status(201).json({
//       message: "✅ Data saved successfully to CSV!",
//       id: data.id,
//     });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data", error });
//   }
// });

// // ====== GET: Retrieve All Data ======
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     if (!fs.existsSync(csvFilePath)) {
//       return res.status(200).json([]);
//     }

//     const csvData = fs.readFileSync(csvFilePath, "utf8");
//     const lines = csvData.trim().split("\n");
//     const headers = lines.shift().split(",");
//     const data = lines.map((line) => {
//       const values = line.split(",");
//       const row = {};
//       headers.forEach((h, i) => {
//         row[h] = values[i];
//       });
//       return row;
//     });

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend connected successfully (CSV Mode)");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} (CSV Mode)`);
// });




// ######################################### FiNAL CODE WITH TIMEZONE SUPPORT and Validate Json FOR CSV BACKEND #######################################################

// import express from "express";
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import { createObjectCsvWriter } from "csv-writer";

// // ====== Express Setup ======
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====== CSV File Path ======
// const dataDir = path.resolve("./data");
// const csvFilePath = path.join(dataDir, "basic_info.csv");

// // Ensure data directory exists
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir);
//   console.log("📁 Created data directory");
// }

// // ====== Helper: Get Timestamp in User Timezone ======
// const getTimestamp = (timezone = "UTC") => {
//   try {
//     const now = new Date();
//     const options = {
//       timeZone: timezone,
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false,
//     };
//     const formatted = new Intl.DateTimeFormat("en-CA", options).format(now);
//     return `${formatted} (${timezone})`;
//   } catch (err) {
//     console.error("❌ Invalid timezone:", timezone);
//     return new Date().toISOString(); // fallback to UTC
//   }
// };

// // ====== Helper: Create CSV Writer ======
// const getCsvWriter = (append = true) => {
//   return createObjectCsvWriter({
//     path: csvFilePath,
//     header: [
//       { id: "id", title: "ID" },
//       { id: "status", title: "Status" },
//       { id: "timestamp", title: "Timestamp" },
//       { id: "schemajson", title: "SchemaJSON" },
//     ],
//     append,
//   });
// };

// // ====== POST: Save Data (Dynamic Timezone Support) ======
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, timezone, ...schemajson } = req.body;

//     // Validate schema JSON and format it (pretty-print)
//     const formattedSchemaJson = JSON.stringify(schemajson, null, 2);

//     // Dynamic timestamp based on user's timezone
//     const resolvedTimezone = timezone || "UTC";
//     const timestamp = getTimestamp(resolvedTimezone);

//     const data = {
//       id: Date.now().toString(),
//       status: status || "draft",
//       timestamp,
//       schemajson: formattedSchemaJson,
//     };

//     const fileExists = fs.existsSync(csvFilePath);
//     const csvWriter = getCsvWriter(fileExists);

//     await csvWriter.writeRecords([data]);
//     console.log(`✅ Data saved to CSV file: ${csvFilePath}`);
//     console.log(`🕒 Time recorded as ${timestamp}`);

//     res.status(201).json({
//       message: "✅ Data saved successfully to CSV!",
//       id: data.id,
//       timestamp: data.timestamp,
//       timezone: resolvedTimezone,
//     });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data", error });
//   }
// });

// // ====== GET: Retrieve All Data ======
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     if (!fs.existsSync(csvFilePath)) {
//       return res.status(200).json([]);
//     }

//     const csvData = fs.readFileSync(csvFilePath, "utf8");
//     const lines = csvData.trim().split("\n");
//     const headers = lines.shift().split(",");
//     const data = lines.map((line) => {
//       const values = line.split(",");
//       const row = {};
//       headers.forEach((h, i) => {
//         row[h] = values[i];
//       });
//       return row;
//     });

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend connected successfully (CSV Mode)");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} (CSV Mode)`);
// });


// THIS CODE IS FOR LOCAL TIME OF THE USERS 
// import express from "express";
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import { createObjectCsvWriter } from "csv-writer";

// // ====== Express Setup ======
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====== CSV File Path ======
// const dataDir = path.resolve("./data");
// const csvFilePath = path.join(dataDir, "basic_info.csv");

// // Ensure data directory exists
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir);
//   console.log("📁 Created data directory");
// }

// // ====== Helper: Get Local Timestamp Based on System Timezone ======
// const getTimestamp = () => {
//   const now = new Date();
//   // This uses the local timezone of the machine running the code
//   const formatted = now.toLocaleString("en-CA", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
//   return formatted;
// };

// // ====== Helper: Create CSV Writer ======
// const getCsvWriter = (append = true) => {
//   return createObjectCsvWriter({
//     path: csvFilePath,
//     header: [
//       { id: "id", title: "ID" },
//       { id: "status", title: "Status" },
//       { id: "timestamp", title: "Timestamp" },
//       { id: "schemajson", title: "SchemaJSON" },
//     ],
//     append,
//   });
// };

// // ====== POST: Save Data ======
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;

//     // Format schema JSON (pretty-print)
//     const formattedSchemaJson = JSON.stringify(schemajson, null, 2);

//     // Use local system time
//     const timestamp = getTimestamp();

//     const data = {
//       id: Date.now().toString(),
//       status: status || "draft",
//       timestamp,
//       schemajson: formattedSchemaJson,
//     };

//     const fileExists = fs.existsSync(csvFilePath);
//     const csvWriter = getCsvWriter(fileExists);

//     await csvWriter.writeRecords([data]);
//     console.log(`✅ Data saved to CSV file: ${csvFilePath}`);
//     console.log(`🕒 Time recorded as ${timestamp}`);

//     res.status(201).json({
//       message: "✅ Data saved successfully to CSV!",
//       id: data.id,
//       timestamp: data.timestamp,
//     });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data", error });
//   }
// });

// // ====== GET: Retrieve All Data ======
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     if (!fs.existsSync(csvFilePath)) {
//       return res.status(200).json([]);
//     }

//     const csvData = fs.readFileSync(csvFilePath, "utf8");
//     const lines = csvData.trim().split("\n");
//     const headers = lines.shift().split(",");
//     const data = lines.map((line) => {
//       const values = line.split(",");
//       const row = {};
//       headers.forEach((h, i) => {
//         row[h] = values[i];
//       });
//       return row;
//     });

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend connected successfully (CSV Mode)");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} (CSV Mode)`);
// });












// Pgadmin 

// import express from "express";
// import cors from "cors";
// import pkg from "pg";

// const { Pool } = pkg;

// // ====== Express Setup ======
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====== PostgreSQL Setup ======
// const pool = new Pool({
//   user: "test12345",       // your pg username
//   host: "localhost",
//   database: "test12345",       // your pg db
//   password: "test12345",      // your pg password
//   port: 5432,
// });

// // ====== Helper: Get Local Timestamp Based on System Timezone ======
// const getTimestamp = () => {
//   const now = new Date();
//   const formatted = now.toLocaleString("en-CA", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
//   return formatted;
// };

// // ====== POST: Save Data ======
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;

//     // Format schema JSON (pretty-print)
//     const formattedSchemaJson = JSON.stringify(schemajson, null, 2);

//     // Use local system time
//     const timestamp = getTimestamp();

//     const id = Date.now().toString(); // SAME AS CSV VERSION

//     await pool.query(
//       `
//       INSERT INTO basic_info (id, status, timestamp, schemajson)
//       VALUES ($1, $2, $3, $4)
//       `,
//       [id, status || "draft", timestamp, formattedSchemaJson]
//     );

//     console.log(`✅ Data saved to PostgreSQL`);
//     console.log(`🕒 Time recorded as ${timestamp}`);

//     res.status(201).json({
//       message: "✅ Data saved successfully to PostgreSQL!",
//       id,
//       timestamp,
//     });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data", error });
//   }
// });

// // ====== GET: Retrieve All Data ======
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM basic_info ORDER BY id ASC");

//     const data = result.rows.map((row) => ({
//       ID: row.id,
//       Status: row.status,
//       Timestamp: row.timestamp,
//       SchemaJSON: row.schemajson,
//     }));

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend connected successfully (PG Mode)");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} (PostgreSQL Mode)`);
// });





// import express from "express";
// import cors from "cors";
// import pkg from "pg";

// const { Pool } = pkg;

// // ====== Express Setup ======
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ====== PostgreSQL Setup ======
// const pool = new Pool({
//   user: "test12345",       // your pg username
//   host: "localhost",
//   database: "test12345",       // your pg db
//   password: "test12345",      // your pg password
//   port: 5432,
// });

// // ====== Helper: Get Local Timestamp Based on System Timezone ======
// const getTimestamp = () => {
//   const now = new Date();
//   const formatted = now.toLocaleString("en-CA", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
//   return formatted;
// };

// // ====== POST: Save Data ======
// app.post("/api/basic-info", async (req, res) => {
//   try {
//     const { status, ...schemajson } = req.body;

//     // Format schema JSON (pretty-print)
//     const formattedSchemaJson = JSON.stringify(schemajson, null, 2);

//     // Use local system time
//     const timestamp = getTimestamp();

//     const id = Date.now().toString(); // SAME AS CSV VERSION

//     await pool.query(
//       `
//       INSERT INTO basic_info (id, status, timestamp, schemajson)
//       VALUES ($1, $2, $3, $4)
//       `,
//       [id, status || "draft", timestamp, formattedSchemaJson]
//     );

//     console.log(`✅ Data saved to PostgreSQL`);
//     console.log(`🕒 Time recorded as ${timestamp}`);

//     res.status(201).json({
//       message: "✅ Data saved successfully to PostgreSQL!",
//       id,
//       timestamp,
//     });
//   } catch (error) {
//     console.error("❌ Error saving data:", error);
//     res.status(500).json({ message: "Error saving data", error });
//   }
// });

// // ====== GET: Retrieve All Data ======
// app.get("/api/basic-info", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM basic_info ORDER BY id ASC");

//     const data = result.rows.map((row) => ({
//       ID: row.id,
//       Status: row.status,
//       Timestamp: row.timestamp,
//       SchemaJSON: row.schemajson,
//     }));

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("❌ Error retrieving data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });

// // ====== GET: Retrieve Latest Completed & Latest Draft ======
// app.get("/api/basic-info/latest", async (req, res) => {
//   try {
//     const completedQuery = await pool.query(
//       `SELECT * FROM basic_info 
//        WHERE status = 'complete'
//        ORDER BY id DESC 
//        LIMIT 1`
//     );

//     const draftQuery = await pool.query(
//       `SELECT * FROM basic_info 
//        WHERE status = 'draft'
//        ORDER BY id DESC 
//        LIMIT 1`
//     );

//     const lastCompleted = completedQuery.rows.length ? completedQuery.rows[0] : null;
//     const lastDraft = draftQuery.rows.length ? draftQuery.rows[0] : null;

//     res.status(200).json({
//       latest_completed: lastCompleted,
//       latest_draft: lastDraft,
//     });

//   } catch (error) {
//     console.error("❌ Error retrieving latest data:", error);
//     res.status(500).json({ message: "Error retrieving latest data", error });
//   }
// });

// // ===== Root Route =====
// app.get("/", (req, res) => {
//   res.send("🚀 Backend connected successfully (PG Mode)");
// });

// // ===== Start Server =====
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} (PostgreSQL Mode)`);
// });



import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

// ====== Express Setup ======
const app = express();
app.use(cors());
app.use(express.json());

// ====== SQLite Setup ======
const db = new Database("database.sqlite");

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS basic_info (
    id TEXT PRIMARY KEY,
    status TEXT,
    timestamp TEXT,
    schemajson TEXT
  )
`);

// ====== Helper: Local Timestamp ======
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

// ====== POST: Save Data ======
app.post("/api/basic-info", (req, res) => {
  try {
    const { status, ...schemajson } = req.body;

    const formattedSchemaJson = JSON.stringify(schemajson, null, 2);
    const timestamp = getTimestamp();
    const id = Date.now().toString();

    const stmt = db.prepare(`
      INSERT INTO basic_info (id, status, timestamp, schemajson)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, status || "draft", timestamp, formattedSchemaJson);

    console.log(`✅ Data saved to SQLite`);
    console.log(`🕒 Time recorded as ${timestamp}`);

    res.status(201).json({
      message: "✅ Data saved successfully to SQLite!",
      id,
      timestamp,
    });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ message: "Error saving data", error });
  }
});

// ====== GET: Retrieve All Data ======
app.get("/api/basic-info", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM basic_info ORDER BY id ASC").all();

    const data = rows.map(row => ({
      ID: row.id,
      Status: row.status,
      Timestamp: row.timestamp,
      SchemaJSON: row.schemajson,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error retrieving data:", error);
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

// ====== GET: Latest Completed & Latest Draft ======
app.get("/api/basic-info/latest", (req, res) => {
  try {
    const latestCompleted = db.prepare(`
      SELECT * FROM basic_info
      WHERE status = 'complete'
      ORDER BY id DESC LIMIT 1
    `).get();

    const latestDraft = db.prepare(`
      SELECT * FROM basic_info
      WHERE status = 'draft'
      ORDER BY id DESC LIMIT 1
    `).get();

    res.status(200).json({
      latest_completed: latestCompleted || null,
      latest_draft: latestDraft || null,
    });
  } catch (error) {
    console.error("❌ Error retrieving latest data:", error);
    res.status(500).json({ message: "Error retrieving latest data", error });
  }
});

// ===== Root Route =====
app.get("/", (req, res) => {
  res.send("🚀 Backend connected successfully (SQLite Mode)");
});

// ===== Start Server =====
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (SQLite Mode)`);
});

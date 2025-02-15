const express = require("express");
const path = require("path");
const cors = require('cors'); // ✅ Import CORS

const app = express();
const PORT = process.env.PORT || 5001; // Use environment port or default 5001

// Middleware
app.use(cors()); // ✅ Enable CORS for all routes - or configure as needed
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, "front"))); // Serve static files from 'front' directory

// Import and use MathRoutes
const mathRoutes = require("./MathRoutes/mathRoutes");
app.use("/math", mathRoutes);

// Serve homepage.html as the default page for root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "front", "homepage.html"));
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
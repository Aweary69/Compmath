const express = require("express");
const path = require("path");

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "front"))); // Serve static files

// Import and use MathRoutes
const mathRoutes = require("./MathRoutes/mathRoutes");
app.use("/math", mathRoutes);

// Serve homepage.html as the default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "front", "homepage.html"));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

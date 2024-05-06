require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/utils/connect-db");
const app = express();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./src/routes/user.routes");
const customerRoutes = require("./src/routes/customer.routes");

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://mern-auth-template-tutorial.netlify.app",
        ],
        credentials: true,
    })
);

app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

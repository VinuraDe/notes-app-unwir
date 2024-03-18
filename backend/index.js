const express = require("express")
const cors = require("cors");
const { connection } = require("./db");
const userRouter = require("./routes/user.routes");
require("dotenv").config();
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to the database", error);
    }

    console.log(`Server is running on port ${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { timeStamp } from "console";

const app = express();
const port = 3000;

let expenses = [];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

app.post("/add", (req, res) => {
    const { description, amount, category } = req.body;
    const expense = {
        description,
        amount: parseFloat(amount).toFixed(2),
        category: category || "General",
        timestamp: new Date().toLocaleString()
    };
    expenses.push(expense);
    res.redirect("/");
});

app.get("/expenses", (req, res) => {
    res.json(expenses);
});

// export to csv
app.get("/export", (req, res) => {
    const header = "Description, Amount, Category, Timestamp\n";
    const rows = expenses.map(exp => `${exp.description},${exp.amount},${exp.category},${exp.timestamp}`).join("\n");
    fs.writeFileSync("expenses.csv", header + rows);
    res.download("expenses.csv");
});

app.get("/total", (req, res) => {
    const total = expenses.reduce((sum, s) => sum + Number(s.amount), 0)
    res.send(`Your Total Expenses Balance is ${total}`);
});

app.listen(port, () => {
    console.log(`listening on ${port}`)

})

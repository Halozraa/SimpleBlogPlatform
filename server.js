import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let posts = []; // Array untuk menyimpan semua posting

// Halaman Home
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// Halaman Artikel
app.get("/articels", (req, res) => {
    res.render("articels", { posts });
});

// Handle Post Request
app.post("/articels", (req, res) => {
    const { title, Description } = req.body;

    if (!title || !Description) {
        res.status(400).send("Title and Description are required!");
        return;
    }

    const post = {
        title: title,
        Description: Description,
    };
    posts.push(post);
    res.redirect("/articels");
});



// Handle DELETE Request untuk menghapus artikel
app.post("/articels/:index/delete", (req, res) => {
    const { index } = req.params;
    posts.splice(index, 1);
    res.redirect("/articels");
});

app.listen(port, () => {
    console.log(`Connected to port ${port}`);
});

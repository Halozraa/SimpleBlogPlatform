import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import methodOverride from "method-override";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

let posts = []; // Array untuk menyimpan semua posting

// Halaman Home
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// Halaman Artikel
app.get("/articles", (req, res) => {
    res.render("articles", { posts });
});

// Handle Post Request
app.post("/articles", (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400).send("Title and description are required!");
        return;
    }

    const post = {
        id : uuidv4(),
        title: title,
        description: description,
    };
    posts.push(post);
    res.redirect("/");
});

app.get("/articles/:id", (req, res) => {
    const { id } = req.params;
    const foundPost = posts.find(post => post.id === id);
    if (foundPost) {
        res.render("articles-edit", { post: foundPost });
    } else {
        res.status(404).send("Artikel tidak ditemukan");
    }
});

app.put("/articles/:id", (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const foundPost = posts.find(post => post.id === id);
    if (foundPost) {
        foundPost.title = title || foundPost.title;
        foundPost.description = description || foundPost.description;
        res.redirect(`/`);
    } else {
        res.status(404).send("Artikel tidak ditemukan");
    }
});


// Handle DELETE Request untuk menghapus artikel
app.delete("/articles/:id", (req, res) => {
    const { id } = req.params;
    const index =posts.findIndex(post=>post.id===id)
    if(index!== -1){
        posts.splice(index,1)
        res.redirect("/")
    }else{
        res.status(404).send("articles tidak ditemukan")
    }
});

// eror handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});


app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
});

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
        id : uuidv4(),
        title: title,
        Description: Description,
    };
    posts.push(post);
    res.redirect("/articels");
});


app.put("/articles/:id/edit", (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const foundPost = posts.find(post => post.id === id);
    if (foundPost) {
        foundPost.title = title || foundPost.title;
        foundPost.description = description || foundPost.description;
        res.redirect(`/articles/${id}`);
    } else {
        res.status(404).send("Artikel tidak ditemukan");
    }
});


// Handle DELETE Request untuk menghapus artikel
app.delete("/articels/:id", (req, res) => {
    const { id } = req.params;
    const index =posts.findIndex(post=>post.id===id)
    if(index!== -1){
        posts.splice(index,1)
        res.redirect("/")
    }else{
        res.status(404).send("articels tidak ditemukan")
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

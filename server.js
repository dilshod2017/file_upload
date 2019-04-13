const express = require("express");
const exphdlbars = require("express-handlebars");
const multer = require('multer');
const body_parser = require("body-parser");
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require("path");
const mysql = require("mysql2");
const btoa = require("btoa");
var app = express();

aws.config.update({
    secretAccessKey: "KD6SuX9Vsy6GtaSjDrM1STdWYcnYaJGyJiFyavLf",
    accessKeyId: "AKIASOEWKNUKEXOJMSI5",
    region: 'us-east-2' // region of your bucket
});
const s3 = new aws.S3();


// const singleUpload = upload.single('image')
// access key    AKIASOEWKNUKEXOJMSI5
// secret key KD6SuX9Vsy6GtaSjDrM1STdWYcnYaJGyJiFyavLf
let pre_params = {
    Bucket: "publicfolder1234/folder",
    Key: ""
}
var date = Date.now();
app.use(body_parser.urlencoded({extended: true}));
const upload = multer({
    storage: multerS3({
        s3,
        bucket: pre_params.Bucket,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname});
        },    
        key: function (req, file, cb) {
            cb(null, file.originalname+"-"+Date.now().toString()
            +path.extname(file.originalname));
        }    
    })    
})    



app.set('view engine', 'hbs');
app.engine('hbs', exphdlbars({
    extname: 'hbs',
    defaultView: 'main'
}));    

app.use(express.static(path.join(__dirname+"/public")));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    port: 3306
});


app.get("/",(req, res)=>{
    res.render("main");
})
app.post('/', upload.single("photo"), (req, res)=>{
    let q = req.file.key;
    connection.query("insert into test_1.photo (image) values(?)", [q], (err, result) => {
        if(err) throw err;
        // res.json(result);
        res.redirect("/done");
    });
})
var fs = require('fs');
app.get('/done',(req, res)=>{
    connection.query(" select image from test_1.photo",(err, result)=>{
        if(err) throw err;
        // res.render("post");
        let params = {...pre_params,Key:result[0].image};
        console.log(params);
        s3.getObject(params,(err, data)=>{
            if(err) throw err;
            res.render("post", { data: `data:image/jpeg;base64, ${btoa(data.Body)}`});
        });
    });
});

app.post("/test",(req, res)=>{

    res.send(req.body)
})














app.listen(3000, ()=>{
    console.log("server wired");
    
})
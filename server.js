require("dotenv/config");
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
    secretAccessKey: `${process.env.AWS_SECRETE_KEY}`,
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    region: 'us-east-2' // region of your bucket
});

const s3 = new aws.S3();

let pre_params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: ""
}
app.use(body_parser.json({ limit: "50mb" }));
var urlencodedParser = body_parser.urlencoded({
    extended: true,
    parameterLimit: 50000
});
app.use(function (req, res, next) {
    console.log('Request URL: ', req.originalUrl);
    next();
});
// const upload = multer({
//     storage: multerS3({
//         s3,
//         bucket: pre_params.Bucket,
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname});
//         },    
//         key: function (req, file, cb) {
//             cb(null, file.originalname+"-"+Date.now().toString()
//             +path.extname(file.originalname));
//         }    
//     })    
// })    



app.set('view engine', 'hbs');
app.engine('hbs', exphdlbars({
    extname: 'hbs',
    defaultView: 'main'
}));

app.use(express.static(path.join(__dirname + "/public")));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    port: 3306
});


app.get("/", (req, res) => {
    res.render("main");
})
const get_img = async (img_add) => {
    let params = { ...pre_params, Key: img_add };
    const result = await s3.getObject(params, (err, data) => {
        if (err) throw err;
        return `data:image/jpeg;base64, ${btoa(data.Body)}`;
    });
    return result;
}
const async_s3 = async (array_img, callback) => {
    let new_arr = [];
    let counter = 1;
    array_img.forEach((item) => {
        new_arr.push(
            new Promise((resolve) => {
                let params = { ...pre_params, Key: item };
                s3.getObject(params, (err, data) => {
                    if (err) throw err;
                    resolve(`data:image/jpeg;base64, ${btoa(data.Body)}`);                    
                });
            })
        );
    })
    Promise.all(new_arr).then((result) => {
        callback(result);
    });
};

app.get("/photo", (req, res) => {
    connection.query(" select * from test_1.photo", (err, result) => {
        if (result && result.length > 0 && result[0].image_key) {
            let image_key = result[0].image_key.split(",");
            async_s3(image_key, (responce) => {
                // console.log(responce);
                // res.json(responce);
                res.render("post", { img: responce });
            });
        } else {
            res.render("post")
        }
    })
})
app.get('/done', (req, res) => {
    connection.query(" select * from test_1.photo", (err, result) => {
        if (err) throw err;
        if (result && result.length > 0) {
            let image_key = result[0].image_key.split(",");
            let img_map;
            async_s3(image_key, (responce) => {
                // console.log("responce", responce);
                let title;
                let head_ar;
                let text_ar;
                let map = [],
                    img_map;
                if (result[0].title)
                    title = result[0].title;
                if (result[0].head)
                    head_ar = result[0].head.split("|");
                if (result[0].text_array)
                    text_ar = result[0].text_array.split("|");
                if(result[0].img_map){
                    img_map = result[0].img_map.split(",")
                    // console.log(img_map);
                }
                let head = []
                let text = [];
                text_ar.forEach((data, index) => {
                    let temp = data.split(",");
                    text.push(temp);
                })
                head_ar.forEach((data, index) => {
                    let temp = data.split(",");
                    head.push(temp);
                });
                if (result[0].map)
                    map = result[0].map.split(",");
                let pre_responce = [];
                let i = -1;
                img_map.forEach(element => {
                    pre_responce.push([element, responce[++i]])
                });
                let image = [...pre_responce];
                let obj = { title, image, head, text, map, img_map }
                // res.send(obj)
                if (req.xhr)
                    res.json(obj);
                else {
                    res.render("post")
                }
            });
        } else {
            res.render("post");
        }
    });
});

var storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, file.originalname + "-" + Date.now() + path.extname(file.originalname));
    }
});

app.post("/test", urlencodedParser, (req, res) => {
    var upload_photos = multer({
        storage: storage
    }).array('img', 10);

    upload_photos(req, res, function (err) {
        if (err) throw err;
        let pre_q = []
        req.files.forEach((item) => {
            pre_q.push(`${item.key}`);
        });
        let text_arr = []
        let head_arr = []
        let body = { ...req.body };
        Object.entries(body).forEach((elem) => {
            // console.log(elem);
            if (elem[0].includes("text_")) {
                let str = elem.join(",")
                text_arr.push(str);
            }
            if (elem[0].includes("head")) {
                let str = elem.join(",")
                head_arr.push(str);
            }
        })
        console.log("req.body",req.body);
        let title = req.body.title;
        let head = head_arr.join("|");
        let text = text_arr.join("|")
        let q = pre_q.join(",");
        let img_map = req.body.image_map;
        // // let img_map = req.body.image_map;
        console.log("image_map",req.body.image_map);
        // console.log("q",q);
        // console.log("text",text);
        // console.log("head",head);
        // console.log("map",req.body.map);
        connection.query(
            "insert into test_1.photo (title, image_key, head, text_array, map, img_map) " +
            "values(?,?,?,?,?,?);",
            [title, q, head, text, req.body.map, img_map],
            (err, result) => {
                if (err) throw err;
                // console.log(result);
                res.redirect("/done")
            })

    });

})
app.listen(3000, () => {
    console.log("server wired");

})

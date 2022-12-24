const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/45a6bc9447"
    const option = {
        method: "POST",
        auth: "caren:1e08dcc547acd45352b66c158aafb1ad-us21"
    };
    const request = https.request(url, option, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })


    request.write(jsonData);
    request.end();
})


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.listen("PORT" || 3000, function(){
    console.log("Server started at port 3000.");
})

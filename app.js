const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAddress = req.body.email;
  const data = {
    members: [
      {
        email_address: emailAddress,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url ="https://us9.api.mailchimp.com/3.0/lists/3a4aeb11be";
  const options = {
    method:"POST",
    auth: "selman:809e08b30918ef859b9ab621b004e2cd-us9"
  };
  const reque = https.request(url,options, function(response){

  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname + "/failure.html");
  }

  response.on("data", function(data){
    console.log(JSON.parse(data));
    });
  });

  reque.write(jsonData);
  reque.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function(){
  console.log("The server is running on port 3000");
});

const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const date=require(__dirname+'/module1.js');
// console.log(date());
console.log(date);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let item=[];
let work=[];

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});

app.get("/",function(req,res){
    
    // res.send(dayWeek);
    //dayType = date();
    dayType=date.getDate();
    res.render('list',{
        dayWeek: dayType,
        newListItem: item
    });
});

app.post("/",function(req,res){
    let query=req.body.button;
    let itemName=req.body.newItem;
    if(query==="Work List")
    {
        console.log("Inside work route...");
        work.push(itemName);
        res.redirect("/work");
    }
    else{
        console.log("Inside home route...");
        item.push(itemName);
        res.redirect("/");
    }
    
    
    
});

// Adding Work route
app.get("/work",function(req,res){
    res.render("list",{dayWeek:'Work List',newListItem:work});
});

// Adding about route
app.get("/about",function(req,res){
    res.render("about");
});
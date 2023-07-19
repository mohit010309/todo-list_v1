const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
const date=require(__dirname+'/module1.js');
// console.log(date());
console.log(date);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// let item=[];
// let work=[];
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
    name:String
});

const ItemModel = mongoose.model("item",itemsSchema);


// creating default documents ( displayed each day )
const defDoc1 = new ItemModel({
    name:"This is default item 1"
});
const defDoc2 = new ItemModel({
    name:"This is default item 2"
});
const defDoc3 = new ItemModel({
    name:"This is default item 3"
});

const docsArray = [defDoc1,defDoc2,defDoc3];

// adding documents in mongoDB database
// ItemModel.insertMany(docsArray);



app.listen(3000,function(){
    console.log("Server is running on port 3000");
});

app.get("/",function(req,res){
    
    // res.send(dayWeek);
    //dayType = date();
    dayType=date.getDate();

    // printing and rendering data from database
    ItemModel.find({}).then(function(data){
        if(data.length===0)
        {
            ItemModel.insertMany(docsArray);
            res.redirect("/");
        }
        else{
            res.render('list',{
                dayWeek: dayType,
                newListItem: data
            });
        }
    });
    
});

app.post("/",function(req,res){
    // let query=req.body.button;
    // let itemName=req.body.newItem;
    // if(query==="Work List")
    // {
    //     console.log("Inside work route...");
    //     work.push(itemName);
    //     res.redirect("/work");
    // }
    // else{
    //     console.log("Inside home route...");
    //     item.push(itemName);
    //     res.redirect("/");
    // }
    

    // using mongoose to post new items
    const itemName = req.body.newItem;
    let query=req.body.button;

    const itemDoc = new ItemModel({
        name:itemName
    });
    itemDoc.save();
    // data successfully added to database

    if(query==="Work List")
    {
        console.log("Inside work route...");
        res.redirect("/work");
    }
    else{
        console.log("Inside home route...");
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

// Adding delete route
app.post("/delete",function(req,res){
    // console.log(req.body.checkbox);
    const checkedID = req.body.checkbox;
    ItemModel.findByIdAndRemove(checkedID).then(function(logs){
        console.log(logs);
        res.redirect("/");
    });
});
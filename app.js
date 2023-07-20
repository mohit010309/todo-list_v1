const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
const date=require(__dirname+'/module1.js');
// console.log(date());
//console.log(date);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// let item=[];
// let work=[];
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
    name:String
});

// const workSchema = new mongoose.Schema({
//     name:String
// });

const ItemModel = mongoose.model("item",itemsSchema);
//const workModel = mongoose.model("work",workSchema);


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

const listSchema = {
    name:String,
    items:[itemsSchema]
};

const listModel = mongoose.model("list",listSchema);

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
    dayType=date.getDate();
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
    const listName = req.body.button;
    //let query=req.body.button;

    
    // data successfully added to database
    const itemDoc = new ItemModel({
        name:itemName
    });
    if(listName===dayType)
    {
        itemDoc.save();
        console.log("Inside home route...");
        res.redirect("/");
    }
    else
    {
        listModel.findOne({name:listName}).then(function(logs){
            console.log(logs);
            logs.items.push(itemDoc);
            logs.save().then(function(){
                res.redirect("/"+listName);
            }); 
        });
    }
    
});

// Adding Work route
// app.get("/work",function(req,res){
//     workModel.find({}).then(function(data){
//         res.render("list",{dayWeek:'Work List',newListItem:data});
//     });
// });

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


// using express-route parameters to add a custom route
app.get("/:custRoute",function(req,res){
    // console.log("Inside custom route");
    // res.send(req.params.custRoute);

    const custListName = req.params.custRoute;
    listModel.findOne({name:custListName}).then(function(logs){
        //console.log(logs);
        if(logs===null)
        {
            //create a new list
            const list = new listModel({
                name:custListName,
                items:docsArray
            });
        
            list.save();
            console.log("List created");
            res.redirect("/"+custListName);
        }
        else
        {
            //show the new list
            console.log("List is present");
            res.render("list",{
                dayWeek: logs.name,
                newListItem: logs.items
            });
        }
        
    });
});
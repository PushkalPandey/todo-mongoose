var express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://app:MeT4cgYA59eYU3tD@cluster0.a2vhomi.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const mongoose = require('mongoose');
var fs = require("fs");
var multer  = require('multer');
var session = require('express-session');
var app = express();

var initiateMongoConnection = require("./database/init");
var userModel = require("./database/models/user");

var todoModel = require("./database/models/todos");


// Database Name
const dbName = 'todos';

let db = null;



app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);


//For creating session
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
  }));


var multerpath = 'uploads/images/';
const upload = multer({ dest: 'uploads/images' })





//Logger middleware
app.use(function(req, res, next)
{
	console.log("its a logger", req.url, req.method);
	next();
})


//To parse all the reqesent parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


//Global Middleware For Multer
// app.use( upload.single("task-picture"));






//For serving the static files
app.use( express.static("./static") );
app.use( express.static("./uploads") );


//Middleware for handling seperate endpoint(right approach)
app.get("/",function(req, res){
	
	if(req.session.isAuthenticated){
		var username = req.session.username; 
		console.log("Inside")
		// var collection = db.collection('todo_list');

		
		var filter = {createdBy: username};
		console.log(filter);
		todoModel.find(filter).then(function(data){
			console.log("Getasd",data);
			
			 res.render("\index.ejs",{username:username,todos:data});
			
		})
		.catch(function(err){
			console.log(err);
			return;
		})		
	
		return;
	} 
	res.redirect("/login"); 
});
    

// app.get("/contact.html", function(req, res)
// {
// 	res.end("contact")
// })

app.get("/auth",function(req, res){
	console.log(req.session);
})




//SIGN up and login 
app.post("/signup", function(req, res)
{
	var username = req.body.username;
	var password = req.body.password;

	       user = {
			username: username,
			password: password
		}

    userModel.create(user).then(function()
	{
		res.redirect("/login");
	})
	.catch(function(err)
	{
		console.log(err.code);
		if(err.code==11000){
			res.render("signup.ejs",{err:"User Already Exists"});
			return;
		}
		
		res.redirect("/signup");
	})

		// getALlUsers((err, data)=>{
		// 	if(err){
		// 		res.send("Something is wrong ");
		// 	}
		// 	else{
		// 		var filteredUsers = data.filter(function(user){
		// 			if(user.username==username){
		// 				return true;
		// 			}
		// 		})
		// 		if(filteredUsers.length)
		// 			{console.log("INSICE");
		// 				res.render ("\signup.ejs",{err: "Userd Exist, Maybe you want to login?? "});
		// 			return;
		// 			}	
		// 		else{
		// 			saveAllUsers(user, function(err)
		// 			{
		// 				if(err)
		// 				{
		// 					res.end("something went wrong");
		// 					return;
		// 				}
			
		// 				res.redirect("/login");
		// 			})
		// 		}
		// 	}
		// });

	
});





app.get('/signup', function(req, res){

	if(req.session.isAuthenticated){
		res.redirect("/");
		return;
	}


	res.render("signup.ejs",{err:""});
});



app.get('/login', function(req, res){

	if(req.session.isAuthenticated){
		res.redirect("/");
		return;
	}


	res.render("login.ejs",{err:""});
})


//Login the user by authenticating them
app.post("/login",function(req, res){
	var username = req.body.username;
	var password = req.body.password;


	userModel.findOne({ username: username, password: password }).then(function(user){
		if(user)
    {
      req.session.isAuthenticated = true;
      req.session.username = username;
console.log("HI")
      res.redirect("/");
	  return;
 
    }

    res.render("login.ejs",{err: "user not found"})
	})
	.catch(function(err){
		console.log("Finding Error");
	})

	// getALlUsers((err, data)=>{
	// 	if(err){
	// 		res.end("something went wrong");
	// 		return;
	// 	}
	// 	// console.log(data);
	// 	 var filteredUsers = data.filter(function(user){
	// 		if(user.username){
	// 			if(user.password===password){
	// 				return true;
	// 			}
	// 	}
	// }) 
	// // console.log(filteredUsers);

	// if(filteredUsers.length)
	// {
	// 	req.session.isAuthenticated = true;
	// 	req.session.username=username; 
	// 	res.redirect("/");
	// 	return;
	// }
		
			
			
		

	// 	res.render ("\login.ejs",{err: "User Not Found "});

	// });

		
		
		


	});



	//LOGOUT
	app.get("/logout",(req,res)=>{

		req.session.isAuthenticated=false;
		req.session.username="";
		
		res.redirect("/login")
	});



//Get All Users Functions
function getALlUsers(callback)
{
	 var collection = db.collection('users');
	 collection.find({}).toArray(callback);	
}


//SaveAllUsers
function saveAllUsers(user, callback)
{
	 var collection = db.collection('users');
	 collection.insertOne(user,callback); 
}
















app.post("/add-todo",  upload.single("task-picture"), function(req, res)
{
	// console.log(req.file);
	var username = req.session.username; 
	
	var todo = {
		text: req.body.text,
		imagePath: req.file.filename, 
		done:false,
		createdBy: username
	}
	

	todoModel.create(todo).then(function()
	{
		res.redirect("/");
	})
	.catch(function(err)
	{
		console.log(err.code);
		if(err.code==11000){
			console.log("DUPLICATE not allowed");
			return;
		}
	})
		
	
});


app.post("/delete-todo", function(req, res){

	console.log( req.body.delete);
	var todoId = req.body.delete;

	
	var filter ={ "_id" : ObjectId(todoId)}

	todoModel.findOne( filter).then(function(data){
		var imagePath = data.imagePath;
		var path = multerpath + imagePath;
		fs.unlink(path, (err) => {
			if (err) {
				console.error(err);
				return;
			} else {
				console.log("File removed:", path);
			}
		});
		// ,callback
		return todoModel.deleteOne(filter);
		
	}).then(function(){
			console.log("File deleted");
			res.redirect("/");

	})
	.catch(function(err) {
		console.log("Error:", err);
		
	})



});



app.post("/check-todo",function(req, res){

	
	var todoId = req.body.check;

	var filter ={ "_id" : ObjectId(todoId)};
	console.log("FIlter",todoId);
	todoModel.findOne( filter).then(function(data){
		
		
		var initialValue = data.done;
		console.log("before",data);
		updateVal = {"done" : !initialValue};
		console.log("aftr",updateVal);

		// ,callback
		return todoModel.updateOne(filter,updateVal);

		
	}).then(function(){
			console.log("Updated",updateVal);
			res.redirect("/");

	})
	.catch(function(err) {
		console.log("Error:", err);
		
	})


//    getAllTodos(function(err, data){
// 	if(err){
// 		res.end("something went wrong");
// 		return;
// 	}
// 	var todoId = req.body.check;

// 	updateTodo(todoId, function(err){
// 		if(err){
// 			res.end("something went wrong");
// 			return;
// 		}
// 		res.redirect("/");
// 	})
//    })
});




	
	


//Update Todo
function updateTodo(todoId,callback){
	console.log(todoId);
	var collection = db.collection('todo_list');
	
	collection.findOne( { "_id" : ObjectId(todoId)},function(err,data){
		if(err){
			console.log("FINDING ERROR:",err);
			return;
		}
		var val = data.done;
		console.log(val);
		collection.updateOne( { "_id" : ObjectId(todoId)}, {$set: { "done" : !val}}   ,callback );
	});
	
	
}




//Get all the todos 
function getAllTodos(callback){
	var collection = db.collection('todo_list');
	collection.find({}).toArray(callback);	
}



initiateMongoConnection().then(function()
{
	console.log("db connected");

	// initEntities(app);

	app.listen(3000, function()
	{
		console.log("hello express , its running");
		
	});
})
.catch(function(err)
{
	console.log("DB error");
})




// // //DB and Server Connect
// client.connect(function()
// {
// 	console.log(" DB is connected");

// 	db = client.db(dbName);
	


// 	app.listen(3000, function()
// 	{
// 		console.log("hello express , its running")
// 	});

// });

const express = require('express');
const app = express()
const port = 3000
const db=require("./database")
const bcrypt = require('bcrypt');
const session = require('express-session')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
db.init();
const userModel = require("./database/models/user.js");
const	bookModel = require("./database/models/book.js");

app.set("view engine","ejs");

//middleware
app.use(express.static("public"))
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))



//routes
app.get("/", function(req, res)
{
  var user=null;
	if(req.session.isLoggedIn)
	{
		user=req.session.user;
	}
    req.session.pageNum = 0;
  
     var limit=req.session.pageNum += 10;
      
  bookModel.find({}).limit(limit).then(function(products)
    {
      var n = req.session.pageNum
      var l = products.length;
      
      if(n<=l)
      {
       
        products.splice(n,l-n)
      }
      else
      {
         req.session.pageNum = 0;
        products.splice(0,0)
      }
       
            res.render("index",{ user:user,products:products})
    })
		.catch(function(err)
	{
		console.log(err,"failed Get user Products")
	})
	
})

app.route('/signin').get((req, res) => {
	res.render('signin',{error:""})
	console.log("in get")
}).post(function(req, res)
{
	
   
const username = req.body.username;
	const password = req.body.password;
  

  if(username && password)
  {
    userModel.findOne( { username: username} )
		.then(function(data)
    {
      console.log(data)
      var user = data;
      if(data === null)
      {
        res.render("signin" ,{error:"Email does not exist"});
      }
      var hash = data.password
      
      bcrypt.compare(password, hash).then(function(result) {
       console.log(result)
       if(result===true)
       {
       
       
           req.session.pageNum = 2;
           req.session.isLoggedIn = true;
           req.session.user = user;
           req.session.email = user.email;
           res.redirect("/");
        
          

       }
       else
       {
         res.render("signin",{error:"INCORRECT PASSWORD"})
       }
       
      });

      
      
    }).catch(function(err)
    {
			
     console.log(err)
    })
  }
  else
  {
    res.render("signin",{error:"please enter email & password!"})
  }

})

app.route("/signup").get((req, res) => {

	res.render('signup',{ error:""})
}).post((req,res)=>
{
	const username=req.body.username;
	const password=req.body.password;
	  var reenter=req.body.reenter;
      

	console.log(username,password)

	if(!username)
	{
			res.render("signup",{ error:"Please Enter Username"})
			return
	}
		if(!password)
	{
			res.render("signup",{ error:"Please Enter Password"})
			return
	}
		

	console.log(username,password)

  if(username && password  && reenter===password)
  {
    
    bcrypt.hash(password,10).then(function(hash) {
         
    
    console.log(typeof(hash));
					userModel.create(
						{
							username:username,
							password:hash,
							isVerifiedMail: true,
                            created_by:username

						}
					)
					.then(()=>
					{  
						
						 res.render("signin",{ error:"Successfully registered"});
						
					})
					.catch((err)=>
					{
						console.log(err)
							res.render("signup",{ error:"User Already Exist!!"})
					})
		})
	}
	else
	{
    res.render("signup",{ error:"Enter a valid detail!!"})
	}
	
})

app.route("/addbook").get((req,res)=>{
     var user=null;
     if(!req.session.isLoggedIn)
     {
         res.render('error/error',{error:"Please Login to add book"})
     
         return
     }
    user= req.session.user;

    bookModel.find()
    .then(function(products)
    {
      
    res.render("addbook",{ user:user,products:products})
    })
    
}).post((req,res)=>
{
    var user=null;
	if(req.session.isLoggedIn)
	{
		user=req.session.user;
        console.log(user)
	}
	const book_name=req.body.book_name;
	const book_price=req.body.book_price;
    const author_name=req.body.author_name;
    const created_by=req.body.created_by;   



	console.log("in proctuct",book_name,book_price,created_by,author_name)
	bookModel.create(
		{
			book_name:book_name,
			book_price:book_price,
            author_name:author_name,
            created_by:created_by
		}
	).then(()=>
	{  
	  res.send("Book addeed")
	})
	.catch((err)=>
	{
		console.log(err)
			res.render("error/error",{ error:"Book is not added"})
	})
})

app.get("/load-more",function(req,res)
{
    var user=null;
      if(req.session.isLoggedIn)
      {
        		user=req.session.user;
      }
  
  var limit=req.session.pageNum += 10;

  bookModel.find({}).limit(limit).then(function(products)
    {
      var n = req.session.pageNum
      var l = products.length;
      
      if(n<=l)
      {
       
        products.splice(n,l-n)
      }
      else
      {
         req.session.pageNum = 0;
        products.splice(0,0)
      }

            res.render("index",{ user:user,products:products})
    
   
    
    })

})


app.route("/deleteBook")
.post(function(req, res)
{
	var user = null;
	if(!req.session.isLoggedIn)
	{
		res.status(401).json({ status: false, message: "please login", data: null })
	
		return
	}
	user = req.session.user
   console.log(user)

	var product_id = req.body.id;
 

  bookModel.deleteOne({ book_name: product_id })
	.then(function()
	{
       console.log("deleted ")

    })
	.catch(function(err)
	{
		console.log(err,"failed")
	})



  
})


app.post("/logout", (req, res) => {
    req.session.destroy();
      
    res.redirect("/");
  });


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
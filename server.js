const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
var app = express();
var http = require('http').Server(app)

const port = process.env.PORT || 3000;//process.env is a key value pair object that will store all app
//enviroment variables. set 3000 to default in case we run the app locally 
console.log(port);
hbs.registerPartials(__dirname + '/views/partials')//partials allow parts of the pages that are rendered to be 
//repeated. Like the header and footer could be partials so you don't have to modify them for each template you have.

//a partial helper can replace what you would otherwise have to write in each of the "render()" methods
//so instead of sending currentYear on every render you may have, you can have helper and this will send
//the first argument to every one of the template. this case "getCurrentYear"
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
})
//helpers can take arguments to do some stuff. in this case it will take the text and uppercase it. 
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

app.set('view engine', 'hbs')//set app configurations by doing app.set.

//app.use is how you would register a middleware
//app.use is synchronus. they get called in the order they are written
app.use((req, res, next)=> {
    var now = new Date().toString();//log the current time everytime a new user logs on the app
    var log = `${now}: ${req.method}, ${req.url}`
    fs.appendFile('server.log', log + '\n', (err) =>{
        if (err) {
            console.log('There was error logging the request');
        }
    })
    
    //console.log(log);
    next()//if you do not call next() in your middleware, the app will never continue. the site will just spin as loading
})

//this middleware does not have a next() to the callback so it will render this hbs but will not let any other part 
//of the app to continue
app.use((req, res, next) => {
    res.render('maintenance.hbs', {
        message: "Issue with page load",
        now: new Date().toString()
    })
})

//app.use can be middleware before the app starts doinga any process. Configurations can be set using middleware
app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    //res.send('<h1>Send Request!</h1>')
    //res.send({name:'Peyman', city:'Marietta', likes:['soccer', 'golf', 'tv']})
    res.render('home.hbs', { 
        welcomeMessage: "Hello",
        pageTitle: "Hi There",
        //currentYear: new Date().getFullYear()//rhis is being sent as a helper now
    })
});

app.get('/bad', (req,res) => {
    res.send({Results: "none", status_code:"500"})
})

//you can render templates, "hbs" is a template engine like EJS. File extension is important. 
//templates can be used to copy something over and over by passing in dynamic variables. 
app.get('/about', (req,res) => {
    res.render('about.hbs', {
        pageTitle: "About Page",
        //currentYear: new Date().getFullYear()//this is being sent as helper now
    })//the default folder for Node js templates is "views" so you can just put the file name to render.
})

var server = http.listen(port, _callbackFunction());

//when you instal socket.io, you can no longer use Express alone for backend, need to use Node HTTP server so that both express and socket.io will run
function _callbackFunction() {
    return () => {
        console.log("Server listening to port", server.address().port)
    }
    
}


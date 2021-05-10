const express = require('express');

const app= express()

const bodyParser= require("body-parser");
const jwt = require("jsonwebtoken");

const JWTSecret = "Francisco e gostoso pra caralho"

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());


function auth(req,res,next)
{
    const authToken = req.headers['authorization'];
    console.log(authToken);
    if(authToken!=undefined)
    {
        const bearer = authToken.split(' ');
        var token =bearer[1]
        jwt.verify(token,JWTSecret,(err,data)=>{
            if(err)
            {
                res.status(401)
                res.json({err:"Token inválido"})
            }else{
                req.token = token;
                req.loggedUser = {id:data.id,email:data.email}
                next();
            }
        })
        console.log(bearer)
    }else{
        res.status(401);
        res.json({err:"Token inválido"})
    }
  
}


var DB = {
    games:[
        {
            id:1,
            title:" CAll of duty MW",
            year:2019,
            price:60
        },
        {
            id:65,
            title:"Sea of thieves",
            year:2018,
            price:40
        },
        {
            id:2,
            title:"Minecraft",
            year:2012,
            price:20
        }
    ],
    users:[
        {
            id:1,
            name:"Francisco Piloto Roque",
            email:"franroque@gmail.com",
            pass:1234
        },
        {
            id:20,
            name:"Guilherme",
            email:"guilherme@gmail.com",
            pass:1234
        }

    ]
}

app.get("/games",auth,(req,res)=>{
    res.statusCode=200;
    res.json(DB.games);
});
app.get("/games/:id",(req,res)=>{
    //Verifica se é numero ou não
    if(isNaN(req.params.id))
    {
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);

        var game = DB.games.find(g=>g.id==id);
        if(game !=undefined)
        {   
            res.statusCode=200
            res.json(game)
        }else{
            res.sendStatus(404)
        }
    }
})
app.post("/games",(req,res)=>{
    var {title,price,year} = req.body;

    DB.games.push({id:33,title,price,year})
    res.sendStatus(200)
})

app.delete("/games/:id",(req,res)=>{
    if(isNaN(req.params.id))
    {
        res.sendStatus(400)
    }else{
        var id = parseInt(req.params.id)

        var index =DB.games.findIndex(g=> g.id ==id)

        if(index==-1)
        {
            res.sendStatus(404)
        }else {
            DB.games.splice(index,1)
            res.sendStatus(200);
        }
    }
})

app.put("/games/:id",(req,res)=>{
    if(isNaN(req.params.id))
    {
        res.sendStatus(400)
    }else{
        var id= parseInt(req.params.id);
        var game= DB.games.find(g=>g.id==id)

        if(game !=undefined)
        {
            var {title,price,year} = req.body;
            if(title!=undefined)
            {
                game.title=title;
            }
            if(price!=undefined)
            {
                game.price=price
            }
            if(year!=undefined)
            {
                game.year = year;
            }

            res.sendStatus(200)
        }else{
            res.sendStatus(404)
        }
    }
})

app.post("/auth",(req,res)=>{
    var {email, pass} = req.body
   
    if(email!=undefined)
    {
       var user = DB.users.find(u=> u.email==email)
        if(user!=undefined)
        {
            if(user.pass == pass)
            {
                jwt.sign({id:user.id,email:user.email},JWTSecret,{expiresIn:'48h'}, (err,token)=>{
                    if(err)
                    {
                        res.status(400)
                        res.json({err:"Flha Interna"})
                    }else{
                        res.status(200)
                        res.json({token:token})
                    }
                })
              
            }else{
                res.status(401);
                res.json({err: "Credenciais inválidas"});
            }
        }else{
            res.status(404);
            res.json({err:"O E-mail enviado não existe na base de dados!"})
        }
        
    }else{
        res.status(400)
        res.json({err:"O email enviado é invalido"})
    }
})
app.listen(3000,()=>{
    console.log("API RODANDO!!")
})
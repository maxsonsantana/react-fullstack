require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res)=>{
    res.send("Fullstack React Course Express Server");
});

app.post("/name", (req, res)=>{
    if(req.body.name){
        return res.json({name: req.body.name})
    }else{
        return res.status(400).json({ error: "Não foi fornecido o Nome"});
    }
});

app.listen(process.env.PORT, ()=>{
    console.log(`O Servidor está executando na porta ${process.env.PORT}`);
});


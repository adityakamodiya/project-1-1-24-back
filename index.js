import cors from 'cors'
import express from 'express'
import connection,{dbName} from './Connection.js'
import bcrypt from "bcrypt";



// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))





// connection.then(()=>{
//    app.listen(8080,()=>{
// console.log("started at 8080")
//    }) 
// })


let db;
let dummy = []
const app = express()
let port = 8001
let j;

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.options('*', cors())

app.use(express.json())
app.use(cors({ origin: "http://localhost:3000" }))
app.post('/receive',async(req,res)=>{
    let {username,age,city,gender} = req.body
    const hashedPassowrd = await bcrypt.hash(req.body.password, 10);
    
    let go = await db.collection('users').find().toArray()
    if(go.length===0){
        let save =await db.collection('users').insertOne({username,age,city,gender,hashedPassowrd})
        console.log(save)
    }
    // console.log(go)   
    console.log(hashedPassowrd)
    for(let i =0;i<go.length;i++){
        if(go[i].username == req.body.username)
        {
            // console.log(')
            res.send('already exist')
            i=go.length;
            j=i
        }
        else {
            j=i;
        }
        
        
    }
    
    if(j==go.length-1){
    let save =await db.collection('users').insertOne({username,age,city,gender,hashedPassowrd})
    // console.log(save)
    res.send('can be added')}
})


// app.options("/",(req,res)=>{
//     res.header("Access-control-Allow-Methods","POST")
//     res.sendStatus(200);
// })

    app.post('/login',async(req,res)=>{
        let {username,password} = req.body
        let go = await db.collection('users').find().toArray()
        // let coll = db.createCollection('aditya')
        
        
        let j;
        // console.log(go)
                for(let i=0;i<go.length;i++){
                    const passwordMatch = await bcrypt.compare(
                        password,
                        go[i].hashedPassowrd
                      );

                    if(go[i].username == username && passwordMatch)
                    {
                    // if(go[i].x.password == x.password)
                        console.log('login successfull')
                        res.send('login successfull')
                        i =go.length
                    }
                    
                    else{
                        j=i
                    }
                }
                if(j==go.length-1){
                    res.send('log in rejected')
                }

                
    })
    
connection
    .then((client) => {
        db = client.db(dbName)
        app.listen(port, () => console.log("server started at port " + port))
    })

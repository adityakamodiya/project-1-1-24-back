import cors from 'cors'
import express from 'express'
import connection, { dbName } from './Connection.js'
import bcrypt from "bcrypt";


let db;
let dummy = []
const app = express()
let port = 8001;
//aditya
let j;
// https://project-frontend-zbjj.onrender.com
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
// http://localhost:3000
app.use(express.json())

app.use(cors({ origin: "http://localhost:3000" }))
app.post('/receive', async (req, res) => {
    let { username, age, city, gender } = req.body
    const hashedPassowrd = await bcrypt.hash(req.body.password, 10);

    let go = await db.collection('users').find().toArray()
    if (go.length === 0) {
        let save = await db.collection('users').insertOne({ username, age, city, gender, hashedPassowrd })
        console.log(save)
    }

    console.log(hashedPassowrd)
    for (let i = 0; i < go.length; i++) {
        if (go[i].username == req.body.username) {
            // console.log(')
            res.send('already exist')
            i = go.length;
            j = i
        }
        else {
            j = i;
        }


    }

    if (j == go.length - 1) {
        let save = await db.collection('users').insertOne({ username, age, city, gender, hashedPassowrd })
        // console.log(save)
        res.send('can be added')
    }
})



app.post('/login', async (req, res) => {
    let { username, password } = req.body
    let go = await db.collection('users').find().toArray()
    // let coll = db.createCollection('aditya')


    let j;
    // console.log(go)
    for (let i = 0; i < go.length; i++) {
        const passwordMatch = await bcrypt.compare(
            password,
            go[i].hashedPassowrd
        );

        if (go[i].username == username && passwordMatch) {
            // if(go[i].x.password == x.password)
            console.log('login successfull')
            res.send('login successfull')
            i = go.length
        }

        else {
            j = i
        }
    }
    if (j == go.length - 1) {
        res.send('log in rejected')
    }


})

app.get('/aaja', async (req, res) => {
    let go = await db.collection('saveimg').find().toArray()
    res.send(go)
})

app.post('/Myprofile', async (req, res) => {

    let { profileData, clickimg } = req.body
    let go = await db.collection('userProfiles').find().toArray()

    for (let i = 0; i < go.length; i++) {
        if (go[i].profileData == profileData) {
            console.log('got it')
            db.collection('userProfiles').deleteOne({ "_id": go[i]._id })
            // go.deleteOne(go[i]._id);
            // db.collection('uersProfiles').deleteOne(go[i]._id)
            // console.log(go)
            break;

        }
    }    
    let save = await db.collection('userProfiles').insertOne({ profileData, clickimg })
    // let go1 = await db.collection('userProfiles').find().toArray()
    // console.log(go1)
    // console.log(save)
    res.send(save)


})
app.get('/WholeProfiles', async (req, res) => {
    let go = await db.collection('userProfiles').find().toArray()
    // console.log(go)
    res.send(go)

})

app.get('/callstreak',async(req,res)=>{
    let save = await db.collection('streaks').find().toArray()
    if(save==''){
        res.send('0')
    }
    else {
        res.send(save)
        console.log(save)
    }
})
app.post('/increasetreak',async(req,res)=>{
    let {profileData,streak} = req.body
    let incrstreak;  

    let go = await db.collection('streaks').find().toArray()
    let vari = true
    // THIS CONDITION WILL WORK IF USER IS ALREADY AVAILABEL IN GO COLLECTION
    if(go!= ''){
    for (let i = 0; i < go.length; i++) {
        if (go[i].profileData == profileData) {
            console.log('got it')
            db.collection('streaks').deleteOne({ "_id": go[i]._id })
            incrstreak = go[i].incrstreak+1; 
            vari = false             
            break;

        }
    }    
    // THIS CONDITION WILL WORK IF USER BUILDIN A NEW STREAK
    if(vari==true){
        incrstreak =streak+1
    }
    let save = await db.collection('streaks').insertOne({ profileData, incrstreak })
    console.log(save)
    }
    
    // console.log(save)
    // res.send(save)
})

connection
    .then((client) => {
        db = client.db(dbName)
        app.listen(port, () => console.log("server started at port " + port))
    })

import { MongoClient,ServerApiVersion } from "mongodb";
const connection = MongoClient.connect(' mongodb+srv://adityakamodiya:11223344@cluster0.j4ukslx.mongodb.net/Mywebsite?retryWrites=true&w=majority')
// mongodb://127.0.0.1:27017


export const dbName = 'Mywebsite'
// export const dbName = 'passwordbase'
export default connection


// import mongoose from "mongoose";



// const connection = mongoose.connect("mongodb+srv://kamodiya1234:adityakamodiya@cluster0.j4ukslx.mongodb.net/?retryWrites=true&w=majority")

// export  default connection
const express = require('express');
require('dotenv').config();
const connection = require('./config/db');
const userRouter = require('./routes/user.routes');
const bookRouter = require('./routes/book.roue');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());
server.use('/user',userRouter);
server.use('/book',bookRouter);

const port = process.env.PORT;

server.listen(3000, async() => {
    try{
       await connection;
       console.log(`Database connected and server is running on port ${port}`);
    }
    catch(err){
        console.log(err);
    }
})
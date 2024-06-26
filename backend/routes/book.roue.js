const express = require('express');
const BookModel = require('../models/Book.model');
const bookRouter = express.Router();
const auth = require('../config/middleware/auth.middleware');

function filterBooksByTime(books, isNew){
   const now = new Date();
   return books.filter(book => {
       const timeDiff = (now - new Date(book.created_at))/(1000*60);
       if(isNew){
        return timeDiff < 10;
       }
       else{
        return timeDiff >= 10;
       }

   })
}

bookRouter.post('/create',auth, async(req,res) => {
    const{title,authorName, price, created_at,id,role} = req.body;
    if(role.includes('creator')){
        try{
            const book = new BookModel({title, authorName, price, created_at,userid:id});
            await book.save();
            res.status(201).send({"msg":"book created"});
        }
        catch(err){
            res.status(400).send({"msg": err.message});
        }
    }else{
        res.status(401).send({"msg": "Unauthorized"});
    }
})

bookRouter.get('/view', auth, async(req,res) => {
    const{role,id} = req.body;
    const {old,new1} = req.query;
    console.log(old,new1);
    try{
        const isOld = req.query.old === '1';
        const isNew = req.query.new1 === '1';
        
        if(role.includes('viewer')){
            const books = await BookModel.find({userid:id});
            let filterBooks;
            if(isOld){
                filterBooks = filterBooksByTime(books,false);
            }else if(isNew){
                filterBooks = filterBooksByTime(books,true);
            }
            res.status(200).send(filterBooks || books);
        }else if(role.includes('view_all')){
            const books = await BookModel.find();
            let filterBooks;
            if(isOld){
                filterBooks = filterBooksByTime(books,false);
            }else if(isNew){
                filterBooks = filterBooksByTime(books,true);
            }
            res.status(200).send(filterBooks || books);
        }else{
            res.status(401).send({"msg": "Unauthorized"});
        }
    }catch(err){
        res.status(400).send({"msg": err.message});
    }
})

bookRouter.delete('/delete/:bookId',auth, async(req,res) => {
    const{bookId} = req.params;
    const{id,role} = req.body;
    try{
        if(role.includes('creator')){
            const result = await BookModel.deleteOne({_id:bookId, userid:id});
            if(result.deletedCount === 0){
                res.status(404).send({"msg": "book not found"});
            }
            res.status(200).send({"msg" : "book has been deleted"});
        }else{
            res.status(401).send({"msg": "Unauthorized"});
        }

    }catch(err){
        res.status(400).send({"msg": err.message});
    }
})

bookRouter.patch('/update/:bookId', auth, async(req,res) => {
    const{bookId} = req.params;
    const{title, authorName, price,id,role} = req.body;
    try{
        if(role.includes('creator')){
            const book = await BookModel.findOne({_id:bookId});
            if(book.userid == id){
                await BookModel.updateOne({_id:bookId},{$set:{title,authorName,price}});
                res.status(200).send({"msg": "book updated successfully"});
            }else{
                res.status(401).send({"msg": "Unauthorized"});
            }
        }else{
            res.status(401).send({"msg": "Unauthorized"});
        }

    }catch(err){
        res.status(400).send({"msg": err.message});
    }


})
module.exports = bookRouter;


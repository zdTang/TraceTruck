/*====================================================================
Discription: subrouter---api
FileName:index.js
Project: Karmax
Programmer: Zhendong Tang (Mike)
Date      : Jan 30, 2020
=====================================================================*/

const Router=require('koa-router');

let router=new Router();

// host/api/
router.all("/",async ctx=>{
       ctx.body=" API  ROOT ";
})

router.get('/login',async ctx=>{
    ctx.body='aaa';
})

module.exports=router.routes();
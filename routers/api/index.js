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

router.get('/plant',async ctx=>{
    //ctx.body='plant';  used for testing
    let plant =await ctx.db.query(`select * from plant`);
    ctx.body=plant;
})

module.exports=router.routes();
/*====================================================================
Discription: The  kernel of the Node.js httpServer
FileName: httpServer.js
Project: Karmax
Programmer: Zhendong Tang (Mike)
Date      : Jan 30, 2020
=====================================================================*/
const Koa=require('koa');
const Router=require('koa-router');
const static=require('../routers/static')
const body=require('koa-better-body');
const path=require('path');
const session=require('koa-session');
const fs=require('fs');
const ejs=require('koa-ejs'); 
const config=require('../config');
const websocket=require('socket.io');  // websocket
//===================httpServer===============================
let httpServer=new Koa();
httpServer.listen(config.PORT);
console.log(`httpServer is running at ${config.PORT}!`);
//===================Websocket================================
let wsServer=websocket.listen(httpServer)
wsServer.on('connection',(sock)=>{
    sock.on('a',(num1,num2)=>{
        console.log(num1,num2);

    })
});





// middleWare:  better-body
// here to setup the upload file directory
httpServer.use(body({
    uploadDir: path.resolve(__dirname,'../static/upload')
}));

// middleware: session
httpServer.keys=fs.readFileSync('../libs/.keys').toString().split('\n');
//console.log(httpServer.keys);
httpServer.use(session({
    maxAge:60*1000, // duration
    renew:  true    // if renew session
},httpServer));

// Bind Database and Config to CTX
httpServer.context.db=require('../libs/database');//add db as a property
httpServer.context.config=config;// add config as a property

// Server side Render

ejs(httpServer,{
    root:path.resolve(__dirname,'../template'),
    layout:false,
    viewExt:'ejs',
    cache:false,
    debug:false
})




let router=new Router();

// Handel error   // the following code is used only on PROD Version
/*==================================================================== */
// router.use(async (ctx,next)=>{
// try{
// await next();//  will try all of the consequent processing
// }
// catch(err)
// {
//ctx.state=500;// Status Code  //doesn't work
//ctx.body='Interan Server Error';  //  display on Html Page
// ctx.throw(500,'WRONG');
// }
// });

// create 3 routers here
router.use('/admin',require('../routers/admin'));
router.use('/api',require('../routers/api'));
router.use('/',require('../routers/www'));
// for static files
static(router,{
   html:365 // 传入一个时间段
});  // 从外面引用，并在这里传一个ROUTER给它







httpServer.use(router.routes());// must have



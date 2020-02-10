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
const body=require('koa-better-body');                 // for POST request parsing
const path=require('path');
const session=require('koa-session');
//const fs=require('await-fs');                          // file IO
const fs=require('fs');
const ejs=require('koa-ejs'); 
const config=require('../config');
const io=require('socket.io'); 
const http=require('http');                        // websocket

const app=new Koa();
const server = http.createServer(app.callback());
const ws=io(server);

server.listen(config.PORT);
console.log(`erver is running at ${config.PORT}!`);

/*============================================================================*/
// Description:   Error Handler                                                //
// uncomment the following code only in production environment                 //
/*============================================================================ */


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

/*================================================= */
// packageName:   'better-body'                      //
// Description:   parse POST formData and body data  //
// used for parseing POST Request                    //
/*================================================== */
app.use(body({
    // this directory is for upload file
    uploadDir: path.resolve(__dirname,'../static/upload')
}));

/*================ Session Module =============== */
// packageName:    'session'                      //
// to set up session parameters                   //
/*=============================================== */

app.keys=fs.readFileSync('../libs/.keys').toString().split('\n');   // keys for encrypting session

app.use(session({
    maxAge:60*1000, // duration  TODO:  use config file 
    renew:  true    // if renew session
},app));

/*================================================================== */
// Description: Bind modules to Koa context prototype                //
// List:                                                             //
// 1.   db ===> mysql                                                //
// 2.   config  ==> config.json file                                 //
/*================================================================== */

app.context.db=require('../libs/database');      //add db as a property
app.context.config=config;                       // add config as a property



/*================================================================== */
// Description: Server side render                                   //
// Here to customize EJS app side render                          //
// package :  'ejs'                                                  //
//                                                                   //
/*================================================================== */
ejs(app,{
    root:path.resolve(__dirname,'../template'),  // directory for template file
    layout:false,
    viewExt:'ejs',
    cache:false,
    debug:false
})

/*================================================================== */
// Description: Create Router                                        //
// Package Name:  "koa-router"                                       //
/*================================================================== */

let router=new Router();

router.use('/admin',require('../routers/admin'));      //  'host/admin'
router.use('/api',require('../routers/api'));          //  'host/api'
router.use('/',require('../routers/www'));
/*================================================================== */
// Description: Static files Router  
//              put this static file router as the last one          //
// Package Name:  "koa-static"                                       //
/*================================================================== */
static(router,
    {
       html:365 // give it a duration
    }); 


/*================================================================== */
// Description: websocket                                            //
// Package Name:  "socket.io"                                        //
/*================================================================== */

//TODO:   
    ws.on('connection', socket=>{

        console.log('a user connected');
        
        //响应某用户发送消息
        socket.on('chat message', msg=>{
        console.log('chat message:' + msg);
            
        // 广播给所有人
        ws.emit('chat message', msg);
        // 广播给除了发送者外所有人
        // socket.broadcast.emit('chat message', msg)
        });  
      
        socket.on('disconnect', ()=>{
        console.log('user disconnected');
        });
      });




app.use(router.routes());// must have

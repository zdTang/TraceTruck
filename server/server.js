/*====================================================================
Discription: The  kernel of the Node.js server
FileName: server.js
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

let server=new Koa();
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
server.use(body({
    // this directory is for upload file
    uploadDir: path.resolve(__dirname,'../static/upload')
}));

/*================ Session Module =============== */
// packageName:    'session'                      //
// to set up session parameters                   //
/*=============================================== */

server.keys=fs.readFileSync('../libs/.keys').toString().split('\n');   // keys for encrypting session

server.use(session({
    maxAge:60*1000, // duration  TODO:  use config file 
    renew:  true    // if renew session
},server));

/*================================================================== */
// Description: Bind modules to Koa context prototype                //
// List:                                                             //
// 1.   db ===> mysql                                                //
// 2.   config  ==> config.json file                                 //
/*================================================================== */

server.context.db=require('../libs/database');      //add db as a property
server.context.config=config;                       // add config as a property



/*================================================================== */
// Description: Server side render                                   //
// Here to customize EJS server side render                          //
// package :  'ejs'                                                  //
//                                                                   //
/*================================================================== */
ejs(server,{
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


server.use(router.routes());// must have
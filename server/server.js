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

// middleWare:  better-body
server.use(body({
    uploadDir: path.resolve(__dirname,'../static/upload')
}));

// middleware: session
server.keys=fs.readFileSync('../libs/.keys').toString().split('\n');
//console.log(server.keys);
server.use(session({
    maxAge:60*1000, // duration
    renew:  true    // if renew session
},server));
// Bind Database and Config to CTX
server.context.db=require('../libs/database');//add db as a property
server.context.config=config;// add config as a property
// Render

ejs(server,{
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
server.use(router.routes());// must have
/*====================================================================
Discription: subrouter---admin
FileName:index.js
Project: Karmax
Programmer: Zhendong Tang (Mike)
Date      : Jan 30, 2020
=====================================================================*/
const Router=require('koa-router');
const fs=require('await-fs');
const path=require('path');
//const config=require('../../config');
const common =require('../../libs/common');
//const {HTTP_ROOT}=ctx.config;

let router=new Router();





// return a login page
router.get('/login',async ctx=>{
    //ctx.body='aaa';  //used for testing 
    await ctx.render('./admin/login',{
        HTTP_ROOT: ctx.config.HTTP_ROOT,
        errmsg: ctx.query.errmsg
    });//注意这个路径是相对于SERVER中设置ROOT路径而言的
    //ctx.body=div.value;// used for testing Try-catch
})


// return a form 
router.post('/login',async ctx=>{
    //ctx.body='aaa';
    const {HTTP_ROOT}=ctx.config;
    let {username,password}=ctx.request.fields; // take fields from frontEnd

    console.log(username + ' '+ password);
    //ctx.body=div.value;// used for testing Try-catch
    let json=(await fs.readFile(path.resolve(__dirname,'../../server/admins.json'))).toString();
    //console.log(json.toString());
    let admins=JSON.parse(json);
    console.log(admins);  // used for testing
    //ctx.body=admins;     // used for testing


    function findAdmin(username){
        let a=null;
        admins.forEach(admin=>{
            if(admin.username==username)
            a=admin;
        });
        return a;
    }

    let admin=findAdmin(username);


    if(!admin){
       // ctx.body='no this user';
      ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('User not exist!')}`); // TO HIDE THE MESSAGE
      //ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=用户不存在}`); // TO HIDE THE MESSAGE
    }else if(admin.password!=common.md5(password+ctx.config.ADMIN_PREFIX)){
        console.log(admin.password);
        console.log(common.md5(password+ctx.config.ADMIN_PREFIX));
      ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('Wrong Password!!')}`); //
    }else{
        ctx.body=" you are in...";
        //success
        ctx.session['admin']=username;//  or set session['admin']=ture
        ctx.redirect(`${HTTP_ROOT}/admin/`);// go to admin's root directory

    }
})

// This router must be put after the Login module
router.all('*',async (ctx,next)=>{
    if(ctx.session['admin']){
        await next();
    }else{
        //ctx.body='You are not administrator!!!!';
        //let
        ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/login`);
    }
} )


// return a login page
router.get('/',async ctx=>{
    ctx.body='admin root';  //used for testing 
    
    //注意这个路径是相对于SERVER中设置ROOT路径而言的
    //ctx.body=div.value;// used for testing Try-catch
})

module.exports=router.routes();
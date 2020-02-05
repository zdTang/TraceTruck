/*====================================================================
Discription: this file is used to test encrypting a password with MD5
FileName: MD5.js
Project: Karmax
Programmer: Zhendong Tang (Mike)
Date      : Jan 30, 2020
=====================================================================*/

const crypto=require('crypto');

let obj=crypto.createHash('md5');
obj.update('123456');
console.log(obj.digest('hax'));
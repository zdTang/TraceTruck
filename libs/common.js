/*====================================================================
Discription: encrypo a string with MD5
FileName: common.js
Project: Karmax
Programmer: Zhendong Tang (Mike)
Date      : Jan 30, 2020
=====================================================================*/
const crypto=require('crypto');

module.exports={
md5(buffer){

    let obj=crypto.createHash('md5');
    obj.update(buffer);
    //'hex' will return a HEX string
    return obj.digest('hex');// not 'hax'
}


};
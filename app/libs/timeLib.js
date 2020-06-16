const moment=require('moment');
const momenttz=require('moment-timezone');
const timeZone='Asia/calcutta';

let now=()=>{
    return moment.utc().format();
}




module.exports={
    now:now,
}


let trim=(x)=>{
    let value=String(x);
    return value.replace(/^\s+|\s+$/gm,'');
}

let isEmpty=(value)=>{
    if(value === null || value === undefined || trim(value) === '' || value.length === 0){
        return true;
    }else{
        return false;
    }
}

let isAdmin=(email)=>{
    if(email === 'admin@gotoonlinetest.com'){
        return true;
    }
    else {
        return false;
    }
}



module.exports={
    isEmpty:isEmpty,
    isAdmin:isAdmin,
}
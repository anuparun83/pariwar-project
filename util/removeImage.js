const fs =require('fs');
const deleteFromFile =(filepath)=>{
    fs.unlink(filepath,(err)=>{
        if(err){console.log(err);return;}
    })
}

exports.deleteFromFile=deleteFromFile;
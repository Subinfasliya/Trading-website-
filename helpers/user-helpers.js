var db=require('../config/connection');
var collection=require('../config/collection');
var personsHelpers=require('../helpers/persons-details') 
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt');
const { resolve } = require('express-hbs/lib/resolver');
module.exports={
    doLogin:(personData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
          
            let person=await db.get().collection(collection.ACTIVEPERSON_COLLECTIONS).findOne({Email:personData.Email})
            
            
             if(person){
                 bcrypt.compare(personData.Password,person.Password).then((status)=>{
                    if(status){
                        console.log(person._id);
                   
                        response.person=person
                        response.active=true
                        resolve(response)
                   
                     
                    }else{
                        resolve({active:false})
                    }
                })
            }else{
                resolve({active:false})
            }
        })
    }
    
}
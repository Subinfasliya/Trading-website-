var db=require('../config/connection');
var collection=require('../config/collection');
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt');
const { response } = require('express');
module.exports={

    addPerson:(personData)=>{
        return new Promise(async(resolve,reject)=>{
            let registerObj={
                CourseDetails:personData.CourseDetails,
                Name:personData.Name,
                Mobile:personData.Mobile,
                Email:personData.Email,
                Password:personData.Password,
                Date: new Date()
            }
           console.log(registerObj);
           registerObj.Password=await bcrypt.hash(registerObj.Password,10)
           db.get().collection('personDetails').insertOne(registerObj).then((data)=>{
            resolve(data.insertedId)
           })
        })
    },
    getAllPersons:()=>{
        return new Promise(async(resolve,reject)=>{
          let persons=await db.get().collection(collection.PERSONS_COLLECTIONS).find().toArray()
            resolve(persons)
        })
    },
    deletePerson:(personId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PERSONS_COLLECTIONS).deleteOne({_id:objectId(personId)}).then((response)=>{
              
                resolve(response)
            })
            
        })
    },
    activePerson:(personId)=>{
        return new Promise(async(resolve,reject)=>{
      let person=await db.get().collection(collection.PERSONS_COLLECTIONS).findOne({_id:objectId(personId)})
      console.log("Person Details"+personId);
      let personDetailsObj={
         ActivePersonId:objectId(personId),
        Coursedetails:person.CourseDetails,
        Name:person.Name,
        Email:person.Email,
        Mobile:person.Mobile,
        Password:person.Password,
        ActiveDate:new Date()
      }
     
      let alreadyExist=await db.get().collection(collection.ACTIVEPERSON_COLLECTIONS).findOne({ActivePersonId:objectId(personId)})
      if(alreadyExist){
         db.get().collection(collection.ACTIVEPERSON_COLLECTIONS).findOne({ActivePersonId:objectId(personId)}).then((data)=>{
          resolve()
         })
      }else{
       
        db.get().collection(collection.ACTIVEPERSON_COLLECTIONS).insertOne(personDetailsObj).then(()=>{
            db.get().collection(collection.PERSONS_COLLECTIONS).deleteOne({_id:objectId(personId)})
            resolve()    
             
                
               
                
            })
      
}
      })
     

 
        

    },
     getActivePersons:()=>{
         return new Promise(async(resolve,reject)=>{
            
        let activePersonsDetails = await  db.get().collection(collection.ACTIVEPERSON_COLLECTIONS).find().toArray()
        resolve(activePersonsDetails)
         })       
     
},
     deleteActivePersons:(activeId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ACTIVEPERSON_COLLECTIONS).deleteOne({_id:objectId(activeId)}).then((response)=>{
                resolve(response)
            })
        })
     },
     adminSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.Password =await bcrypt.hash(adminData.Password,10)
            db.get().collection(collection.ADMIN_COLLECTIONS).insertOne(adminData).then((response)=>{
                resolve(adminData)
            })
        })
     },
     adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            
      let admin=await db.get().collection(collection.ADMIN_COLLECTIONS).findOne({Email:adminData.Email})
      if(admin){
        
        bcrypt.compare(adminData.Password,admin.Password).then((adminstatus)=>{
            if(adminstatus){
                console.log("login success");
                response.admin=admin
                response.adminstatus=true
                resolve(response)
            }else{
                console.log("login failed");
                resolve({adminstatus:false})
            }
        })
      }else{
        console.log("login failed");
        resolve({adminstatus:false})
      }
        })
     }


}
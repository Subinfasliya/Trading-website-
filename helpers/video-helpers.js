var db=require('../config/connection');
var collection=require('../config/collection');
var personsHelpers=require('../helpers/persons-details');
var objectId=require('mongodb').ObjectId
const { response } = require('../app');
const { resolve } = require('express-hbs/lib/resolver');
module.exports={
    addVideos:(videoData,callback)=>{
        
            db.get().collection(collection.VIDEO_COLLECTIONS).insertOne(videoData).then((data)=>{
                callback(data.insertedId)
            })
        
    },
    getAllVideos:()=>{
        return new Promise(async(resolve,reject)=>{
            let videos=await db.get().collection(collection.VIDEO_COLLECTIONS).find().toArray()
            resolve(videos)
        })
    },
    deleteVideo:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VIDEO_COLLECTIONS).remove({_id:objectId(data)}).then((response)=>{
                resolve(response)
            })
        })
    }
}
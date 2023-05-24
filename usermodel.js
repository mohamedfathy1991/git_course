const mongoose = require('mongoose')

const auth =require('./auth')
//  new encription way#####
const hashpassword=require('./encriptpassword')
// #####
const db = 'mongodb://0.0.0.0/NEWDATA'
const bcrypt =require('bcrypt')


const userSchema= mongoose.Schema({
    name:{type:String,
        required:true
    },
    password:{
        type :String,
        required:true

    },
    telephone:{
       type: String,
        

    },
    email:{
        type:String,
         required:true
 
     }
    
})

const User =mongoose.model('user',userSchema)



exports.createuser=(data)=>{
   

    return new Promise((resolve, reject) => {
         mongoose.connect(db).then(()=>{
            

            return User.findOne({email:data.email}).then(user=>{
                
             
                
                if (user)
                {
                    mongoose.disconnect()
                    reject(' email  is used')
    
    
    
    
                }else{
                    
                    return bcrypt.hash(data.password,10)
                }
            }).then(hashpassword=>{
                let user= new User({
                name: data.name,
                email:data.email,
                password : hashpassword,
               
            })  
             
            return user.save() 

            }).then(user=>{
                let token =auth.createtoken({name:user.name,email:user.email})
                mongoose.disconnect()

                resolve(token,user)
            }).catch(err=>{
                mongoose.disconnect()
                reject(err)
                
            })

         })
        
    })

}




exports.login=(email,password)=>{
    return new Promise((resolve, reject) => {
        console.log("email at model is:" + email)
        
    mongoose.connect(db).then(()=>{
        
       return User.findOne({email:email})
    }).then(user=>{
        
        console.log(user)
        if(!user){
            mongoose.disconnect()
            reject('no email found')
    

        }else{
            return  bcrypt.compare(password,user.password).then(checkpass=>{
              console.log(checkpass)
                if(checkpass){
                    console.log("true")
    
                      mongoose.disconnect()
                     resolve(user)}
                else{ 
                    mongoose.disconnect()
                    reject('password incorrect')}
              })
    
    
    
    
           
        }
    }).catch(err=>{
        mongoose.disconnect()
        reject(err)
    })



    })

}


exports.getusers=()=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(db).then(()=>{
            return User.find()
        }).then(users=>{
            mongoose.disconnect()
            resolve(users)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}



exports.getmyuser=(name)=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(db).then(()=>{
            return User.findOne({name:name})
        }).then(users=>{
            mongoose.disconnect()
            resolve(users)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.isadmin=(user)=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(db).then(()=>{
            return User.findOne({name:user})
        }).then(users=>{
            mongoose.disconnect()
            resolve(users)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}
    




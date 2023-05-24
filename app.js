const mongose= require('mongoose')
const express= require('express')
const auth =require('./auth')

const authorization =require('./authorization')
const htterror= require('http-error')
const cors= require('cors')

const app= express()
const db= "mongodb://0.0.0.0:27017/cairouniv"
const bodyParser = require('body-parser')


const loger= require('morgan')
const http= require('http')
const server=http.createServer(app)
const adminroute= require("./admin.route")

const productRouter= require('./product.route')

const userrouter= require('./route/userroute')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



-app.use(cors())
 

app.use((req,res,next)=>{
    console.log('the header here')

    // console.log(req.headers)
    
    
    res.setHeader("Access-Control-Allow-Origin","http://localhost:4000")
    res.setHeader('Access-Control-Allow-Methods',"*")
    res.setHeader('Access-Control-Allow-Headers',"Authorization,content-type")
    
    // هنا بقول لو اي حد كاتب انه يخل يسجل او يعمل ريجستر دخله من غير توكن علي طول 
    if ((req.url=="/login"||req.url=="/adduser") && (req.method=="POST"||req.method=="OPTIONS")){ //كتبت options عشان في بدايه الطلب بيبعت اوبشن            
       
        next()
    } else{
        
        console.log("url not login and signup")

        // لو اي حد داخل علي صفحه غير التسجيل شيك علي التوكن لو صح دخله 
        if(req.headers['verfytoken']!=undefined){
            auth.verficationtoken(req.headers['verfytoken']).then(result=>{
               
                
                 req.body.admin =result.name          
             
                

                 authorization.authrized(result.name,req.url,req.method,req,res,next)
                // .then(result=>{next()}).catch(res=>{
                //     res.status(401).json({
                //         sucess:false,msg:"un authorized"
                //     })
                // })
                // console.log("verfit token is:"+result.email)
                // next()
                
            }).catch(err=>{res.status(200).json({msg:"invalid authentication"})
           return;})
   }else{return res.status(500).json({msg:"please verfy token "})    
     }       
    }})
   
   


app.use(loger('dev'))


app.use('/',productRouter)

app.use('/',adminroute)


app.use('/',userrouter)





app.listen(3000,()=>{
    console.log('enter node server ')
})
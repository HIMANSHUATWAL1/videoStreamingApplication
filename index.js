import express from "express"
import cors from "cors"
import multer from "multer"
import {v4 as uuidv4} from "uuid"
import path from "path"
import { log } from "console"
import fs from "fs"
import {exec} from "child_process"    // watch out
import { stderr, stdout } from "process"


const app=express()

// multer middleware------------------>
// "diskStorage" is used to store file in personal disk
const storage=multer.diskStorage({
    // cb --->callback
    destination:function(request,file,cb){
        cb(null,"./uploads")

    },
    filename:function(request,file,cb){
        // path--->(.mkv or extension of a path of file)
        cb(null,file.fieldname+"-"+uuidv4()+path.extname(file.originalname))

    }
})


//multer   Configuration -------------->

const upload=multer({
    storage:storage
})







//<------------------We are using MiddleWare---------------------------->
app.use(
    cors({
        origin:["http://localhost:8000","http://localhost:5173"]
        ,
        credentials:true
    })
)

// middlewares  here we can generate custome midddlewares 
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*") // watch it allows necessary header only .
     res.header(
        "Access-Control-Allow-Origin","Origin,X-Requested-with,Content-type,Accept"
     )
     next()  // writing it necessory

})

// allows us to give data as json type------>
app.use(express.json())

// it allows to except url encoded data--->
app.use(express.urlencoded({extended:true}))
// location for serve static  file
app.use("/uplods",express.static("uplods"))


//routs configuration----------------------> 

app.get('/',(request,response)=>{
    response.json({message:"hello whats up!"})

})


app.post('/upload',upload.single('file'),function(req,res){
   
const lessionId=uuidv4()
// here we storing path of file in drive  and send to the queue

const videoPath=req.file.path

// it is a path of directory not a video--->

const outputPath=`./uplods/courses/${lessionId}`

// m3u8 ----->(It is a UTF-8 encoaded playlist file(index-file or plain text file))  for more search about it in google

const hlsPath=`${outputPath}/index.m3u8`
console.log("hlsPath:",hlsPath)


if(!fs.existsSync(outputPath)){
    // recursive::Indicates whether parent folders should be created. If a folder was created, the path to the first created folder will be returned.
       fs.mkdirSync(outputPath,{recursive:true})
}

// <------------------ffmpeg command--------------------------->
//codec--->pakages that merges the mp3,audio,subtitle etc files
const ffmpegCommand= `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

// no queue because of proof of production,not to be used in production---->

exec(ffmpegCommand,(error,stdout,stderr)=>{
    if (error) {
        console.log(`exec error :${error}`);
    }
    console.log(`stdout :${stdout}`);
    console.log(`stderror :${stderr}`);

    const videoUrl=`http://localhost:49152/uploads/courses/${lessionId}/index.m3u8`

    res.json({
        message:"video converted to hls formate",
        videoUrl:videoUrl,
        lessionId:lessionId
    })
})

    
})
n 

app.listen(49152,()=>{
    console.log("App is listning at port 49152 ....");
})
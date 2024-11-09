import mongoose from "mongoose";


const MONGODB_URI: string = process.env.MONGODB_URI as string;


const connect  = async () => {

const connectionState = mongoose.connection.readyState;

if(connectionState === 1 )
{
    console.log("connected!!!")
    return
}

if(connectionState === 2)
{
  console.log("connecting...")
    return
}

try {
    mongoose.connect(MONGODB_URI ,{
        dbName : "Restapi",
        bufferCommands:true
    } )
    console.log("connected!!!")
} catch (error) {
    console.log(error)
}


}

export default connect;

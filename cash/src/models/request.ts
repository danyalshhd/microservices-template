import mongoose, {Document, Types} from "mongoose";

// An interface that describes the properties
// that are requried to create a new Request
interface AgentAttrs{
  userId: mongoose.Types.ObjectId;
  createdAt:Date;
  kind:"agentCashIn"|"agentCashOut"|"friend";
  agentId:mongoose.Types.ObjectId;
  cash_in_out:"in"|"out";
  amount:number;
}


interface AgentCashOutAttrs extends AgentAttrs{
  status:"created"|"pending"|"accepted"|"rejected";
  expiresAt:Date;
}
interface FriendAttrs{
  userId: mongoose.Types.ObjectId;
  createdAt:Date;
  kind:"agentCashIn"|"agentCashOut"|"friend";
  friendId:mongoose.Types.ObjectId;
  deleted:boolean;
  amount: number;
  status:"created"|"pending"|"accepted"|"rejected";
  expiresAt:Date;
}


interface RequestAttrs {
  userId: mongoose.Types.ObjectId;
  createdAt:Date;
  kind:"agentCashIn"|"agentCashOut"|"friend";
}


// An interface that describes the properties
// that a Request Model has
interface RequestModel extends mongoose.Model<RequestDoc> {
  build(attrs: RequestAttrs): RequestDoc;
}
// An interface that describes the properties
// that a Request Document has
interface RequestDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  createdAt:Date;
  kind:"agentCashIn"|"agentCashOut"|"friend";
}

const friendSchema= new mongoose.Schema({
    friendId:{
      type:String,
      required:true,
      index:true,
    },
    deleted:{
      type:Boolean,
      required:true
    },
    amount:{
      type:Number,
      required:true,
    },
    status:{
      type:String,
      required:true,
    },
    expiresAt:{
      type:Date,
      required:true,
    },
})

const AgentSchema= new mongoose.Schema({
    agentId:{
      type:mongoose.Schema.Types.ObjectId,
      required: true,
    },
    cash_in_out:{
      type:String,
      required:true
    },
    amount:{
      type:Number,
      required:true
    },
})

const AgentCashOutSchema= new mongoose.Schema({
    agentId:{
      type:mongoose.Schema.Types.ObjectId,
      required: true,
    },
    cash_in_out:{
      type:String,
      required:true
    },
    amount:{
      type:Number,
      required:true
    },
    status:{
      type:String,
      required:true,
    },
    expiresAt:{
      type:Date,
      required:true,
    }
})


const requestSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    createdAt:{
      type: Date,
      required:true
    }

},
    {
      discriminatorKey:'kind',
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    
  }
);



requestSchema.statics.build = (attrs: RequestAttrs) => {
  return new Requests(attrs);
};

const Requests = mongoose.model<RequestDoc, RequestModel>("Request", requestSchema);
const AgentCashIn=Requests.discriminator<AgentAttrs>("agentCashIn",AgentSchema);
const AgentCashOut=Requests.discriminator<AgentCashOutAttrs>("agentCashOut",AgentCashOutSchema);
const Friend=Requests.discriminator<FriendAttrs>("friend",friendSchema)


export { Requests,AgentCashIn,AgentCashOut,Friend };

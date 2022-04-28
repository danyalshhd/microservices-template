import mongoose, {Document, Types} from "mongoose";

// An interface that describes the properties
// that are requried to create a new Request
export interface RequestAttrs {
  userId: string;
  friends:{
    friendId:string;
    fullname:string;
    lastRequestAmount:number;
    createdAt:Date;
    deleted:boolean;
  }[];
  requests:{
    id:Types.ObjectId;
    friendId: string;
    fullname: string;
    amount: number;
    status:string;
    expiresAt:Date;
    createdAt:Date;
  }[]

}

// An interface that describes the properties
// that a Request Model has
interface RequestModel extends mongoose.Model<RequestDoc> {
  build(attrs: RequestAttrs): RequestDoc;
}

// An interface that describes the properties
// that a Request Document has
interface RequestDoc extends mongoose.Document {
  userId: string;
  friends:{
    friendId:string;
    fullname:string;
    lastRequestAmount:number;
    createdAt:Date;
    deleted:boolean;
  }[];
  requests:{
    id:Types.ObjectId;
    friendId: string;
    fullname: string;
    amount: number;
    status:string;
    expiresAt:Date;
    createdAt:Date;
  }[];

}
const subrequestSchema=new mongoose.Schema({
  id:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
  },

  friendId: {
    type: String,
  required: true,
},
fullname:{
  type:String,
  required:true,
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
  createdAt:{
    type:Date,
    required:true,
  },

},
{
  toJSON: {
    transform(doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
  },
},
_id:false,
})

const friendsSchema=new mongoose.Schema({
  friendId:{type:String, required:true},
  fullname:{type:String, required:true},
  lastRequestAmount:{type:Number, required:true},
  createdAt:{type:Date,required:true},
  deleted:{type:Boolean,required:true}
})
const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    friends:{
      type:[friendsSchema],
      required:false,
    },
    requests:{
      type: [subrequestSchema],
      required: false
    },
},
    {
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

export { Requests };

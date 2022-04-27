import mongoose, {Document, Types} from "mongoose";

// An interface that describes the properties
// that are requried to create a new Request
export interface RequestAttrs {
  userId: mongoose.Types.ObjectId;
  friendId:string;
  deleted:boolean;
  amount: number;
  status:string;
  expiresAt:Date;
  createdAt:Date;
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
  friendId:string;
  deleted:boolean;
  amount: number;
  status:string;
  expiresAt:Date;
  createdAt:Date;

}
const requestSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
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
    createdAt:{
      type: Date,
      required:true
    }

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

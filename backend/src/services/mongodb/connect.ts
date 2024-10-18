import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;

export const connectDb = async () => {
  mongoose
    .connect(uri, {
      dbName: "aum_tool_zns",
    })
    .then(
      () => {
        console.log("Connected to MongoDB");
      },
      (err) => {
        console.error(err);
      }
    );
};

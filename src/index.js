import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app is listening at PORT : ${process.env.PORT}`);
    });

    app.on("error", (error) => {
      console.log("error", error);
      throw error;
    });
  })
  .catch((error) => {
    console.log("MongoDb connecton is failed!\n");
  });

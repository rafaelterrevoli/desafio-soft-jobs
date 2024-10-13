import express from "express"; 
import morgan from "morgan";
import cors from "cors";
import softJobsRouter from "./routes/softJobs.routes.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(softJobsRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000 -  url: http://localhost:3000")
});


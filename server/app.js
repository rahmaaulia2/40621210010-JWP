const express = require("express");
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("./controllers/task");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 100000,
  })
);
app.use(cors());
app.post("/", createTask);
app.get("/", getAllTasks);
app.put("/:id", updateTask);
app.delete("/:id", deleteTask);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

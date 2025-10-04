const { Task, sequelize } = require("../models");

module.exports = class TaskController {
  static async createTask(req, res) {
    const t = await sequelize.transaction();
    try {
      console.log('Request Body:', req.body); // Debugging line
      const { title, status } = req.body;
      const newTask = await Task.create({ title, status }, { transaction: t });
      await t.commit();
      res.status(201).json({message: "Task Created", task: newTask});
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getAllTasks(req, res) {
    try {
      console.log('Fetching all tasks'); // Debugging line
      const tasks = await Task.findAll();
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async updateTask(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { title, status } = req.body;
      const task = await Task.findByPk(id);
      if (!task) throw { name: "NotFound", message: "Task Not Found" };
      task.title = title;
      task.status = status;
      await t.commit();
      res.status(200).json(task);
    } catch (error) {
      await t.rollback();
      console.error(error);
      if (error.name === "NotFound") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
  static async deleteTask(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) throw { name: "NotFound", message: "Task Not Found" };
      await Task.destroy({ where: { id } }, { transaction: t });
      await t.commit();
      res.status(200).json({message: "Task Deleted"});
    } catch (error) {
      await t.rollback();
      console.error(error);
      if (error.name === "NotFound") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
};

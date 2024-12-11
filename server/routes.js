const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}

// GET /todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    try {
        const todos = await collection.find({}).toArray();
        console.log("Fetched Todos:", todos); // Debug log
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Error fetching todos" });
    }
});

// POST /todos
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ mssg: "error no todo found"});
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    try {
        const newTodo = await collection.insertOne({ todo, status: false });
        const insertedTodo = { todo, status: false, _id: newTodo.insertedId };
        console.log("New Todo Inserted:", insertedTodo); // Debug log
        res.status(201).json(insertedTodo);
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ mssg: "Error creating todo" });
    }
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    try {
        const deletedTodo = await collection.deleteOne({ _id });
        console.log("Deleted Todo:", deletedTodo); // Debug log
        res.status(200).json(deletedTodo);
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ mssg: "Error deleting todo" });
    }
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
        return res.status(400).json({ mssg: "invalid status"});
    }

    try {
        const updatedTodo = await collection.updateOne(
            { _id },
            { $set: { status: !status } }
        );
        console.log("Updated Todo:", updatedTodo); // Debug log
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ mssg: "Error updating todo" });
    }
});

module.exports = router;

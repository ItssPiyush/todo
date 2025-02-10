import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

//register a new user endpoing /auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const insertUser = db.prepare(
      `INSERT INTO users(username , password) VALUES (? , ?)`
    );
    const result = insertUser.run(username, hashedPassword);

    //now that we have a user, I want to add their first todo for them
    const defaultTodo = `Hello :) Add your first todo!`;
    const insertTodo = db.prepare(
      `INSERT INTO todo(user_id, task) VALUES(?,?)`
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // create a token
    const token = jwt.sign({ id: result.lastInsertRowid }, process.env.jwt);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.post("/login", (req, res) => {
  // const
});

export default router;

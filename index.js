const express = require("express");
const db = require("./data/db");
const server = express();
const port = 5000;
server.use(express.json());

//Get list of users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      console.log("Error on GET /api/users", err);
      res
        .status(500)
        .send({ error: "The users information could not be retrieved." });
    });
});

//Get user by ID
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).send(user);
      } else {
        res
          .status(404)
          .send({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error on GET /api/users/:id", err);
      res
        .status(500)
        .send({ error: "The user information could not be retrieved." });
    });
});

//Create a user
server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .send({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(req.body)
      .then(userObj => {
        res.status(201).send(userObj);
      })
      .catch(err => {
        console.log("Error on POST /api/users", err);
        res.status(500).send({
          error: "There was an error while saving the user to the database"
        });
      });
  }
});

//Delete user by ID
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user => {
      if (user) {
        res.status(200).send({ message: "Successfully removed user." });
      } else {
        res
          .status(404)
          .send({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error on DELETE /api/users/:id", err);
      res.status(500).send({ error: "The user could not be removed" });
    });
});

//Updating user by ID
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;

  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .send({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, req.body)
      .then(count => {
        if (count > 0) {
          res.status(200).send(req.body);
        } else {
          res.status(404).send({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.log("Error on PUT /api/users/:id", err);
        res
          .status(500)
          .send({ error: "The user information could not be modified." });
      });
  }
});

server.listen(port, () => {
  console.log(`\n*** Listening on port ${port}\n`);
});

const { ObjectID } = require("bson");
const express = require("express");
 
// Instance of the Express router
// Router will be added as middleware and will take control of requests starting with path /time-entry.
const timeTrackerAppRoutes = express.Router();
 
// Used to connect to the database
const dbo = require("../db/conn");
 
// Converts an id to an ObjectId
const ObjectId = require("mongodb").ObjectId;

// Returns an array of all time entries
timeTrackerAppRoutes
.route("/time-entries")
.get((req, res) => {
  const db_connect = dbo.getDb();
  db_connect
    .collection("timeEntries")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result)
    });
});
 
// Creates a new time entry
timeTrackerAppRoutes
.route("/time-entries/add")
.post((req, res) => {
  const db_connect = dbo.getDb();
  const myObj = {
    name: req.body.name,
    categoryId: req.body.categoryId,
    start: req.body.start,
    end: req.body.end
  };
  db_connect
    .collection("timeEntries")
    .insertOne(myObj, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

// Returns a single time entry with a specified _id
timeTrackerAppRoutes
.route("/time-entries/:_id")
.get((req, res) => {
  const db_connect = dbo.getDb();
  const myQuery = { _id: ObjectID(req.params._id) };
  db_connect
    .collection("timeEntries")
    .findOne(myQuery, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

// Updates a single time entry with a specified _id
timeTrackerAppRoutes
.route("/time-entries/update/:_id")
.post((req, res) => {
  const db_connect = dbo.getDb();
  const myQuery = { _id: ObjectID(req.params._id) };
  const newValues = {
    $set: {
      name: req.body.name,
      categoryId: req.body.categoryId,
      start: req.body.start,
      end: req.body.end
    }
  };
  db_connect
    .collection("timeEntries")
    .updateOne(myQuery, newValues, (err, result) => {
      if (err) throw err;
      console.log("1 Time Entry Updated");
      res.json(result);
    });
});

// Deletes a single time entry with a specified _id
timeTrackerAppRoutes
.route("/time-entries/:_id")
.delete((req, res) => {
  const db_connect = dbo.getDb();
  const myQuery = { _id: ObjectID(req.params._id) };
  db_connect
    .collection("timeEntries")
    .deleteOne(myQuery, (err, result) => {
      if (err) throw err;
      console.log("1 Time Entry Deleted");
      res.json(result);
    });
})

// Resets "category" field of all time entries with a specified categoryId
timeTrackerAppRoutes
.route("/time-entries/categoryDeleted/:categoryId")
.post((req, res) => {
  const db_connect = dbo.getDb();
  const myQuery = { categoryId: req.params.categoryId };
  const newValues = {
    $set: {
      categoryId: ""
    }
  }
  db_connect
    .collection("timeEntries")
    .updateMany(myQuery, newValues, (err, result) => {
      if (err) throw err;
      console.log(`${result.modifiedCount} Time Entries Updated`);
      res.json(result);
    });
})

// Returns an array of all categories
timeTrackerAppRoutes
.route("/categories")
.get((req, res) => {
  const db_connect = dbo.getDb();
  db_connect
    .collection("categories")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result)
    });
});

// Creates a new category
timeTrackerAppRoutes
.route("/categories/add")
.post((req, res) => {
  const db_connect = dbo.getDb();
  const myObj = {
    name: req.body.name,
    color: req.body.color
  };
  db_connect
    .collection("categories")
    .insertOne(myObj, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

// Returns a single category with a specified categoryId
timeTrackerAppRoutes
.route("/categories/:categoryId")
.get((req, res) => {
  const db_connect = dbo.getDb();
  const myQuery = { _id: ObjectID(req.params.categoryId) };
  db_connect
    .collection("categories")
    .findOne(myQuery, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

// Updates a single category with a specified categoryId
timeTrackerAppRoutes
.route("/categories/update/:categoryId")
.post((req, res) => {
  const db_connect = dbo.getDb();
  const myQuery = { _id: ObjectID(req.params.categoryId) };
  const newValues = {
    $set: {
      name: req.body.name,
      color: req.body.color
    }
  };
  db_connect
    .collection("categories")
    .updateOne(myQuery, newValues, (err, result) => {
      if (err) throw err;
      console.log("1 Category Updated");
      res.json(result);
    });
});

// Deletes a single category with a specified categoryId
timeTrackerAppRoutes
.route("/categories/:categoryId")
.delete((req, res) => {
  const db_connect = dbo.getDb();
  const myFirstQuery = { _id: ObjectID(req.params.categoryId) };
  db_connect
    .collection("categories")
    .deleteOne(myFirstQuery, (err, result) => {
      if (err) throw err;
      console.log("1 Category Deleted");
      res.json(result);
    });
})
  
module.exports = timeTrackerAppRoutes;
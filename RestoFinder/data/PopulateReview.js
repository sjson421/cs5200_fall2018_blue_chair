const reviewDao = require("./daos/review.daos.server");
const mongoose = require("mongoose");
const db = require("./db").mongoURI;
// Note: I already populated the DB,  do not run it again
mongoose
  .connect(db)
  .then(conn => console.log("mongodb connected"))
  .catch(err => console.log(err));

reviewDao.createDefaultYelpuser();
// reviewDao
//   .populateReviews()
  

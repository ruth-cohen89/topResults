const db = require("./db.js");

const User = function(tutorial) {
  this.fullName = tutorial.title;
  this.userName = tutorial.description;
};

User.create('/adduser', async (req, res) => {
    let sql = 'INSERT INTO users SET ?';
    const result = await dbQuery(sql, res, user);
  

  });
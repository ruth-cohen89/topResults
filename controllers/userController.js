const User = require("../users/tutorial.model.js");

exports.create = catchAsync(async (req, res) => {
  
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = new User ({
    fullName: req.body.fullName,
    userName: req.body.userName
  });

  User.create(user, (err, data) => {
    if (err)
      
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });


}
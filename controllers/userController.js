const getAllusers = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
const postUsers = (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  res.status(201).json({
    newUser,
  });
};

module.exports = {
  getAllusers,
  postUsers,
};

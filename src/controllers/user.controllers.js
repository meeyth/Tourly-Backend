export const registerUser = (req, res) => {
  res.send("Register a new user");
};

export const loginUser = (req, res) => {
  res.send("Log in user");
};

export const getUserProfile = (req, res) => {
  const { userId } = req.params;
  res.send(`Get profile of user ID: ${userId}`);
};

export const updateUser = (req, res) => {
  const { userId } = req.params;
  res.send(`Update user with ID: ${userId}`);
};

export const deleteUser = (req, res) => {
  const { userId } = req.params;
  res.send(`Delete user with ID: ${userId}`);
};

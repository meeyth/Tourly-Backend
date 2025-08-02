export const followUser = (req, res) => {
  res.send("Follow a user");
};

export const unfollowUser = (req, res) => {
  res.send("Unfollow a user");
};

export const getFollowers = (req, res) => {
  const { userId } = req.params;
  res.send(`Get followers of user ID: ${userId}`);
};

export const getFollowing = (req, res) => {
  const { userId } = req.params;
  res.send(`Get users followed by user ID: ${userId}`);
};

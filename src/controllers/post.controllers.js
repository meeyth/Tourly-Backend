export const createPost = (req, res) => {
  res.send("Create a new post");
};

export const getAllPosts = (req, res) => {
  res.send("Get all posts");
};

export const getSinglePost = (req, res) => {
  const { postId } = req.params;
  res.send(`Get post with ID: ${postId}`);
};

export const updatePost = (req, res) => {
  const { postId } = req.params;
  res.send(`Update post with ID: ${postId}`);
};

export const deletePost = (req, res) => {
  const { postId } = req.params;
  res.send(`Delete post with ID: ${postId}`);
};

export const likePost = (req, res) => {
  const { postId } = req.params;
  res.send(`Like post with ID: ${postId}`);
};

export const createComment = (req, res) => {
  res.send("Add a comment");
};

export const getCommentsByPost = (req, res) => {
  const { postId } = req.params;
  res.send(`Get comments for post ID: ${postId}`);
};

export const updateComment = (req, res) => {
  const { commentId } = req.params;
  res.send(`Update comment with ID: ${commentId}`);
};

export const deleteComment = (req, res) => {
  const { commentId } = req.params;
  res.send(`Delete comment with ID: ${commentId}`);
};

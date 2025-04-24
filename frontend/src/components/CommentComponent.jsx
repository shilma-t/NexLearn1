import { useEffect, useState } from "react";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/CommentService";

const CommentComponent = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const res = await fetchComments(postId);
    setComments(res.data);
  };

  const handleAdd = async () => {
    await createComment({ postId, username: "Student", content: newComment });
    setNewComment("");
    loadComments();
  };

  const handleDelete = async (id) => {
    await deleteComment(id);
    loadComments();
  };

  return (
    <div>
      <h3>Comments</h3>
      <input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.username}</strong>: {c.content}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentComponent;

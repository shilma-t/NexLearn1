import axios from "axios";
const API_URL = "http://localhost:9006/api/comments";

export const fetchComments = (postId) => axios.get(`${API_URL}/${postId}`);
export const createComment = (data) => axios.post(API_URL, data);
export const updateComment = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteComment = (id) => axios.delete(`${API_URL}/${id}`);

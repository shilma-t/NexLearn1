import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

const CommunityGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [desc, setDesc] = useState('');
  const sessionData = localStorage.getItem('skillhub_user_session');
  const userEmail = sessionData ? JSON.parse(sessionData).email : null;
  const userName = sessionData ? JSON.parse(sessionData).name : null;
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isOwner = group && group.ownerId === userEmail;

  useEffect(() => {
    axiosInstance.get(`/groups/${id}`)
      .then(res => {
        setGroup(res.data);
        setDesc(res.data.description);
        if (res.data.systemMessages && res.data.systemMessages.some(msg => msg.includes(userEmail))) {
          setJustAdded(true);
        }
      })
      .catch(() => setError('Failed to load group'))
      .finally(() => setLoading(false));
  }, [id, userEmail]);

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const debouncedSearch = debounce(async (query, currentMembers) => {
    if (!query) return setUserResults([]);
    try {
      const res = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);
      setUserResults(res.data.filter(u => !currentMembers.includes(u.email)));
    } catch {}
  }, 400);

  useEffect(() => {
    if (isOwner && userSearch) debouncedSearch(userSearch, group ? group.members : []);
    else setUserResults([]);
    // eslint-disable-next-line
  }, [userSearch, group]);

  const handleAddMember = async (email, name) => {
    setAddingMember(true);
    try {
      await axiosInstance.post(`/groups/${id}/add/${encodeURIComponent(email)}?ownerId=${encodeURIComponent(userEmail)}&ownerName=${encodeURIComponent(userName)}`);
      setUserSearch('');
      setUserResults([]);
      const res = await axiosInstance.get(`/groups/${id}`);
      setGroup(res.data);
    } catch {
      setError('Failed to add member');
    }
    setAddingMember(false);
  };

  const handleRemoveMember = async (email) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await axiosInstance.post(`/groups/${id}/remove/${encodeURIComponent(email)}?ownerId=${encodeURIComponent(userEmail)}`);
      const res = await axiosInstance.get(`/groups/${id}`);
      setGroup(res.data);
    } catch {
      setError('Failed to remove member');
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Leave this group?')) return;
    try {
      await axiosInstance.post(`/groups/${id}/leave?userId=${encodeURIComponent(userEmail)}`);
      navigate('/community');
    } catch {
      setError('Failed to leave group');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axiosInstance.post(
        `/groups/${id}/message?senderId=${encodeURIComponent(userEmail)}`,
        {
          senderId: userEmail,
          senderName: userName,
          content: message
        }
      );
      setMessage('');
      const res = await axiosInstance.get(`/groups/${id}`);
      setGroup(res.data);
    } catch {
      setError('Failed to send message');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Delete this group?')) return;
    try {
      await axiosInstance.delete(`/groups/${id}?userId=${encodeURIComponent(userEmail)}`);
      navigate('/community');
    } catch {
      setError('Failed to delete group');
    }
  };

  const handleUpdateDesc = async () => {
    try {
      await axiosInstance.put(`/groups?userId=${encodeURIComponent(userEmail)}`, { ...group, description: desc });
      setEditingDesc(false);
      setGroup({ ...group, description: desc });
    } catch {
      setError('Failed to update description');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <div className="container mt-4">
      <h2>{group.name}</h2>
      {justAdded && (
        <div className="alert alert-info">You were added to the community by the owner.</div>
      )}
      <div className="mb-2">
        {editingDesc ? (
          <>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} className="form-control mb-2" />
            <button className="btn btn-success btn-sm me-2" onClick={handleUpdateDesc}>Save</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditingDesc(false)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{group.description}</span>
            {isOwner && <button className="btn btn-link btn-sm" onClick={() => setEditingDesc(true)}>Edit</button>}
          </>
        )}
      </div>
      <div className="mb-3">
        <strong>Members:</strong>
        <ul>
          {group.members.map(email => (
            <li key={email} className="d-flex align-items-center">
              <span>{email}</span>
              {isOwner && email !== userEmail && (
                <button className="btn btn-danger btn-sm ms-2" onClick={() => handleRemoveMember(email)}>Remove</button>
              )}
            </li>
          ))}
        </ul>
        {isOwner && (
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search users to add..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              disabled={addingMember}
            />
            {userResults.length > 0 && (
              <ul className="list-group mt-1">
                {userResults.map(u => (
                  <li key={u.email} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{u.name} ({u.email})</span>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAddMember(u.email, u.name)} disabled={addingMember}>Add</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {!isOwner && (
          <button className="btn btn-warning btn-sm" onClick={handleLeaveGroup}>Leave Group</button>
        )}
      </div>
      {isOwner && (
        <button className="btn btn-danger mb-3" onClick={handleDeleteGroup}>Delete Group</button>
      )}
      <hr />
      <h4>System Messages</h4>
      <div className="mb-3" style={{ maxHeight: 100, overflowY: 'auto', border: '1px solid #eee', padding: 10 }}>
        {group.systemMessages && group.systemMessages.length > 0 ? (
          group.systemMessages.map((msg, idx) => (
            <div key={idx} className="text-info small">{msg}</div>
          ))
        ) : (
          <div className="text-muted small">No system messages.</div>
        )}
      </div>
      <h4>Messages</h4>
      <div className="mb-3" style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 10 }}>
        {group.messages.length === 0 ? (
          <div>No messages yet.</div>
        ) : (
          group.messages.map(msg => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.senderName || msg.senderId}:</strong> {msg.content}
              <span className="text-muted small ms-2">{new Date(msg.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
      {isOwner && (
        <form onSubmit={handleSendMessage} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      )}
    </div>
  );
};

export default CommunityGroupDetail; 
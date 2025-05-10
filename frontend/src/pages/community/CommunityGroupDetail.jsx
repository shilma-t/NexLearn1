import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';

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

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axiosInstance.delete(`/groups/${id}/message/${messageId}?userId=${encodeURIComponent(userEmail)}`);
      const res = await axiosInstance.get(`/groups/${id}`);
      setGroup(res.data);
    } catch {
      setError('Failed to delete message');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      <Sidebar />
      <main style={{
        marginLeft: '260px',
        width: '100%',
        padding: '80px 32px 40px',
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
      }}>
        <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 24 }}>{group.name}</h2>
        {justAdded && (
          <div className="alert alert-info" style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
            You were added to the community by the owner.
          </div>
        )}
        <div className="mb-4">
          {editingDesc ? (
            <>
              <textarea 
                value={desc} 
                onChange={e => setDesc(e.target.value)} 
                className="form-control mb-2" 
                style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}
              />
              <button 
                className="btn btn-success btn-sm me-2" 
                onClick={handleUpdateDesc}
                style={{ background: '#28a745', border: 'none' }}
              >
                Save
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setEditingDesc(false)}
                style={{ background: '#6c757d', border: 'none' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span style={{ color: '#ccc' }}>{group.description}</span>
              {isOwner && (
                <button 
                  className="btn btn-link btn-sm" 
                  onClick={() => setEditingDesc(true)}
                  style={{ color: '#4b0076', textDecoration: 'none' }}
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
        <div className="mb-4">
          <strong style={{ color: '#fff' }}>Members:</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {group.members.map(email => (
              <li key={email} className="d-flex align-items-center mb-2" style={{ color: '#ccc' }}>
                <span>{email}</span>
                {isOwner && email !== userEmail && (
                  <button 
                    className="btn btn-danger btn-sm ms-2" 
                    onClick={() => handleRemoveMember(email)}
                    style={{ background: '#dc3545', border: 'none' }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isOwner && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search users to add..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                disabled={addingMember}
                style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}
              />
              {userResults.length > 0 && (
                <ul className="list-group mt-2">
                  {userResults.map(u => (
                    <li key={u.email} className="list-group-item d-flex justify-content-between align-items-center" style={{ background: '#181818', border: '1px solid #333', color: '#fff' }}>
                      <span>{u.name} ({u.email})</span>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleAddMember(u.email, u.name)} 
                        disabled={addingMember}
                        style={{ background: '#4b0076', border: 'none' }}
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {!isOwner && (
            <button 
              className="btn btn-warning btn-sm" 
              onClick={handleLeaveGroup}
              style={{ background: '#ffc107', border: 'none', color: '#000' }}
            >
              Leave Group
            </button>
          )}
        </div>
        {isOwner && (
          <button 
            className="btn btn-danger mb-4" 
            onClick={handleDeleteGroup}
            style={{ background: '#dc3545', border: 'none' }}
          >
            Delete Group
          </button>
        )}
        <hr style={{ borderColor: '#333' }} />
        <h4 style={{ color: '#fff', marginBottom: 16 }}>Messages</h4>
        <div style={{ marginBottom: 24, maxHeight: '400px', overflowY: 'auto' }}>
          {group.messages && group.messages.map((msg, idx) => (
            <div key={idx} className="mb-3" style={{ background: '#2a2a2a', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{msg.senderName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.8em' }}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                  {msg.senderId === userEmail && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteMessage(msg.id)}
                      style={{ background: '#dc3545', border: 'none', padding: '2px 8px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p style={{ color: '#fff', margin: 0 }}>{msg.content}</p>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#fff', marginBottom: 16 }}>System Messages</h4>
        <div style={{ marginBottom: 24 }}>
          {group.systemMessages && group.systemMessages.map((msg, idx) => (
            <div key={idx} className="alert alert-info mb-2" style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
              {msg}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4">
          <div className="mb-3">
            <textarea
              className="form-control"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ background: '#4b0076', border: 'none' }}
          >
            Send Message
          </button>
        </form>
      </main>
    </div>
  );
};

export default CommunityGroupDetail; 
import { useParams, Link } from "react-router-dom";
import ChatBox from "../../components/ChatBox";
import { useGeneral } from "../../context/GeneralContext";
import { useState, useEffect } from "react";
import api from "../../Api/axios";

const ClientChat = () => {
  const { freelancerId: urlFreelancerId } = useParams();
  const { user } = useGeneral();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all freelancers for selection if none selected
  useEffect(() => {
    if (!urlFreelancerId) {
      setLoading(true);
      api.get("/auth/freelancers")
        .then(res => {
          setFreelancers(res.data);
        })
        .finally(() => setLoading(false));
    }

  }, [urlFreelancerId]);

  const currentClientId = user?.id || user?._id;

  if (!currentClientId) return <div>Loading user context...</div>;

  if (!urlFreelancerId) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Chat with Freelancers</h2>
        {loading ? <p>Loading freelancers...</p> : (
          <div className="freelancer-list">
            {freelancers.length === 0 && <p>No freelancers found.</p>}
            {freelancers.map(f => (
              <Link to={`/client/chat/${f._id}`} key={f._id} className="card" style={{ display: 'block', marginBottom: '10px', textDecoration: 'none', color: 'inherit' }}>
                <h4>{f.name}</h4>
                <p>{f.email}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/client/chat" style={{ marginBottom: '10px', display: 'inline-block' }}>&larr; Back to List</Link>
      <ChatBox
        clientId={currentClientId}
        freelancerId={urlFreelancerId}
      />
    </div>
  );
};

export default ClientChat;
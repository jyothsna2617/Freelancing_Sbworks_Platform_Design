import { useEffect, useState } from "react";
import { useGeneral } from "../../context/GeneralContext";
import api from "../../Api/axios";
import { Link } from "react-router-dom";

const WorkingProjects = () => {
  const { user } = useGeneral();
  const [projects, setProjects] = useState([]);

  /* ---------- FETCH DATA ---------- */
  const fetchData = async () => {
    try {
      const res = await api.get(`/applications/freelancer/${user.id}`);

      // ✅ only accepted projects
      const accepted = res.data.filter((p) => p.status === "accepted");

      // ✅ remove duplicate projects
      const unique = [
        ...new Map(
          accepted.map((p) => [p.projectId?._id, p])
        ).values(),
      ];

      setProjects(unique);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Working Projects</h2>

      {projects.length === 0 && <p>No active projects</p>}

      {projects.map((p) => (
        <div key={p._id} className="card">

          {/* ✅ PROJECT TITLE */}
          <h4>Project: {p.projectId?.title}</h4>

          {/* ✅ SUBMIT WORK */}
          <Link
            to={`/freelancer/submit-work/${p.projectId?._id || p.projectId}/${p.clientId?._id || p.clientId}`}
            className="submit-btn"
          >
            Submit Work
          </Link>

          {/* ⭐ FIXED CHAT LINK */}
          <Link
            to={`/freelancer/chat/${p.clientId?._id || p.clientId}`}
            className="chat-btn"
          >
            Open Chat
          </Link>


        </div>
      ))}
    </div>
  );
};

export default WorkingProjects;
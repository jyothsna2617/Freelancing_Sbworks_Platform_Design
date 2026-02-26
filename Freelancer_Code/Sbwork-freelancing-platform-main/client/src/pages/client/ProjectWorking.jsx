import { useEffect, useState } from "react";
import { useGeneral } from "../../context/GeneralContext";
import api from "../../Api/axios";
import ChatBox from "../../components/ChatBox";

const ProjectWorking = () => {

  const { user } = useGeneral();

  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/applications/client/${userId}`);


        const accepted = res.data.filter(p => p.status === "accepted");

        const unique = [
          ...new Map(
            accepted.map(p => [String(p.projectId?._id), p])
          ).values()
        ];

        setProjects(unique);

        const subRes = await api.get(`/submissions/client/${userId}`);
        setSubmissions(subRes.data);


      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  }, [user]);

  const approveSubmission = async (id) => {
    try {
      const res = await api.put(`/submissions/${id}/status`, {
        status: "approved"
      });

      setSubmissions(prev =>
        prev.map(s => s._id === id ? res.data : s)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const requestRevision = async (id) => {
    try {
      const res = await api.put(`/submissions/${id}/status`, {
        status: "revision"
      });

      setSubmissions(prev =>
        prev.map(s => s._id === id ? res.data : s)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async (project) => {
    try {
      await api.post(`/reviews`, {
        projectId: project.projectId?._id,
        freelancerId: project.freelancerId,
        clientId: user?._id || user?.id,
        rating: Number(rating),
        feedback
      });


      alert("⭐ Review Submitted");
      setFeedback("");
      setRating(5);

    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return <p>Loading user...</p>;
  }
  console.log("PROJECTS DATA:", projects);
  console.log("SUBMISSIONS DATA:", submissions);

  return (
    <div>
      <h2>Working Projects</h2>

      {projects.length === 0 && <p>No active projects</p>}

      {projects.map(p => {

        const projectSubmission = submissions.find(
          s => String(s.projectId) === String(p.projectId?._id)
        );

        return (
          <div key={p._id} className="card">

            <h4>Project: {p.projectId?.title}</h4>

            {(user?._id || user?.id) && p.freelancerId && (
              <ChatBox
                clientId={user?._id || user?.id}
                freelancerId={p.freelancerId?._id || p.freelancerId}
              />
            )}


            {projectSubmission ? (
              <div>

                <h4>📁 Freelancer Submission</h4>

                <a href={projectSubmission.workLink} target="_blank" rel="noreferrer">
                  View Submitted Work
                </a>

                <p>Status: {projectSubmission.status}</p>

                {projectSubmission.status === "submitted" && (
                  <>
                    <button onClick={() => approveSubmission(projectSubmission._id)}>
                      ✅ Approve
                    </button>

                    <button onClick={() => requestRevision(projectSubmission._id)}>
                      🔁 Request Revision
                    </button>
                  </>
                )}

                {projectSubmission.status === "approved" && (
                  <div>

                    <h4>⭐ Rate Freelancer</h4>

                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value={1}>⭐</option>
                      <option value={2}>⭐⭐</option>
                      <option value={3}>⭐⭐⭐</option>
                      <option value={4}>⭐⭐⭐⭐</option>
                      <option value={5}>⭐⭐⭐⭐⭐</option>
                    </select>

                    <textarea
                      placeholder="Write feedback..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />

                    <button onClick={() => submitReview(p)}>
                      Submit Rating
                    </button>

                  </div>
                )}

              </div>
            ) : (
              <p>⏳ Waiting for freelancer submission...</p>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default ProjectWorking;
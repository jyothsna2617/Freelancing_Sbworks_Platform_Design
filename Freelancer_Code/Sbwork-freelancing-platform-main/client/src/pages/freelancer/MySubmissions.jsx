import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useGeneral } from "../../context/GeneralContext";

const MySubmissions = () => {
  const { user } = useGeneral();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/submissions/freelancer/${user.id}`)
        .then(res => setSubs(res.data));
    }
  }, [user]);


  return (
    <div>
      <h2>My Submissions</h2>

      {subs.map(s => (
        <div key={s._id} className="card">
          <p>Project: {s.projectId?.title || "Unknown Project"}</p>
          <p>Status: {s.status}</p>
          <a href={s.workLink} target="blank">View Work</a>
        </div>
      ))}

    </div>
  );
};

export default MySubmissions;

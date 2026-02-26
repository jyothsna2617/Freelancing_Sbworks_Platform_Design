import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useGeneral } from "../../context/GeneralContext";

const MyApplications = () => {
  const { user } = useGeneral();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/applications/freelancer/${user.id}`)
        .then(res => setApps(res.data));
    }
  }, [user]);


  return (
    <div>
      <h2>My Applications</h2>

      {apps.map(app => (
        <div key={app._id} className="card">
          <p>Project: {app.projectId?.title || "Unknown Project"}</p>
          <p>Bid: ₹{app.bidAmount}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}

    </div>
  );
};

export default MyApplications;

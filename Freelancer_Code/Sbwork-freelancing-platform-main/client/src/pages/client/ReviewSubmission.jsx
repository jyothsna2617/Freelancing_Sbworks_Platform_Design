import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useGeneral } from "../../context/GeneralContext";

const ReviewSubmissions = () => {
  const { user } = useGeneral();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    if (user?._id) {
      api.get(`/submissions/client/${user._id}`)
        .then(res => setSubs(res.data));
    }
  }, [user]);

  const update = (id, status) => {
    api.put(`/submissions/${id}/status`, { status });
  };


  return subs.map(s => (
    <div key={s._id}>
      <a href={s.workLink} target="_blank">View Work</a>
      <button onClick={() => update(s._id, "approved")}>Approve</button>
      <button onClick={() => update(s._id, "revision")}>Revision</button>
    </div>
  ));
};

export default ReviewSubmissions;

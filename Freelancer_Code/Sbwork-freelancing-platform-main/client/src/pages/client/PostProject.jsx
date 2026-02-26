import { useState } from "react";
import { useGeneral } from "../../context/GeneralContext";
import api from "../../Api/axios";

const PostProject = () => {

  const { user } = useGeneral();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/projects", {
        title,
        description,
        budget,
        clientId: user.id
      });

      alert("✅ Project Posted Successfully");

      setTitle("");
      setDescription("");
      setBudget("");

    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Post New Project</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">
          Post Project
        </button>

      </form>
    </div>
  );
};

export default PostProject;
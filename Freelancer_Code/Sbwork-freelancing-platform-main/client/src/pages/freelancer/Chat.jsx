import { useParams } from "react-router-dom";
import { useGeneral } from "../../context/GeneralContext";
import ChatBox from "../../components/ChatBox";

const Chat = () => {
  const { user } = useGeneral();
  const { clientId } = useParams();

  if (!clientId) {
    return (
      <div style={{ padding: 40 }}>
        Select project from Working Projects to chat
      </div>
    );
  }

  return (
    <ChatBox
      clientId={clientId}
      freelancerId={user.id}
    />
  );
};

export default Chat;
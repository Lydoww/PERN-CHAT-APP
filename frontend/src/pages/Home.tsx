import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import StarField from "../components/style/StarField";

const Home = () => {
  return (
    <>
      <StarField />
      <div className="flex h-[80vh] w-full md:max-w-screen-lg md:h-[550px] rounded-lg overflow-hidden bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebar />
        <MessageContainer />
      </div>
    </>
  );
};
export default Home;

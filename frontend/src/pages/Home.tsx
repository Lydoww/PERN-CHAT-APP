import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import StarField from "../components/threeJs/StarField";

const Home = () => {
  return (
    <>
      <StarField />
      <div className="flex h-[80vh] w-full md:max-w-screen-lg md:h-[550px] rounded-lg overflow-hidden bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg opacity-80">
        <Sidebar />
        <MessageContainer />
      </div>
    </>
  );
};
export default Home;

import { useSelector } from "react-redux";
import Main from "../Components/Main";
function Home() {
  let user = useSelector((state) => state.user.value);

  return (
    <div>
      <Main user={user} />
    </div>
  );
}

export default Home;

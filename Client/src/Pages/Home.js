import { useSelector } from "react-redux";
import Main from "../Components/Main";
function Home() {
  const url = process.env.REACT_APP_URL;
  let user = useSelector((state) => state.user.value);

  return (
    <div>
      <Main user={user} />
    </div>
  );
}

export default Home;

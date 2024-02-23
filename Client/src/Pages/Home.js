import Main from "../Components/Main";
import { useSelector  } from "react-redux";

function Home() {
  let user = useSelector((state) => state.user.value);
  console.log(user);
  

  return (
    <div>
      <Main />
    </div>
  );
}

export default Home;

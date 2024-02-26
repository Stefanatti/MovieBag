import { lazy,Suspense } from "react";
import { useSelector  } from "react-redux";

function Home() {
  let user = useSelector((state) => state.user.value);
  console.log(user);
  const Main = lazy(()=> import('../Components/Main'))

  return (
    <div><Suspense fallback = { <div> Please Wait... </div> } >
    <Main /></Suspense></div>
  );
}

export default Home;

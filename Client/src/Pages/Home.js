import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

function Home() {
  const url = process.env.REACT_APP_URL;
  const Main = lazy(() => import("../Components/Main"));
  let user = useSelector((state) => state.user.value);

  return (
    <div>
      <Suspense>
        <Main user={user} />
      </Suspense>
    </div>
  );
}

export default Home;

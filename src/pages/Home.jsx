import { lazy, Suspense } from "react";

import Header from "../components/Header";
import CityList from "../components/CityList";
const TypeList = lazy(() => import("../components/TypeList"));
const TopHotels = lazy(() => import("../components/TopHotels"));

const Home = () => {
  return (
    <div>
      <Header />
      <CityList />
      <Suspense fallback={<div>Loading...</div>}>
        <TypeList />
        <TopHotels />
      </Suspense>
    </div>
  );
};

export default Home;

import { Routes, Route } from "react-router";
import { BeerPage } from "./components/BeerPage/BeerPage";
import { BeerSimpleList } from "./components/BeerSimpleList/BeerSimpleList";
import { useState } from "react";
import { BeerLazyList } from "./components/BeerLazyList/BeerLazyList";
import { Switch, Space } from "antd";
import { useAppStore } from "./store/store";
import s from './App.module.css'




function App() {
  const [appMode, setAppMode] = useState<AppMode>("LAZY_SCROLL");


  const clearStores = useAppStore((state) => state.clearStore);
  const onChangeHandler = () => {
    clearStores()
    appMode === "LAZY_SCROLL"
      ? setAppMode("SIMPLE")
      : setAppMode("LAZY_SCROLL");
  };

  return (
    <>
    <div className={s.switch}>
      <Space direction="vertical">
        <Switch
          checkedChildren="LAZY SCROLL"
          unCheckedChildren="SIMPLE"
          defaultChecked
          onClick={onChangeHandler}
        />
      </Space>
      </div>
      <Routes>
        <Route
          path={`/`}
          element={
            appMode === "LAZY_SCROLL" ? <BeerLazyList /> : <BeerSimpleList />
          }
        />
        <Route
          path={`/beer/:beerID`}
          element={<BeerPage appMode={appMode} />}
        />
      </Routes>
    </>
  );
}

export default App;

export type AppMode = "SIMPLE" | "LAZY_SCROLL";

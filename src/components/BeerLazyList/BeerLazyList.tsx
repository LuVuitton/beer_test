import { useAppStore, useLazyListStore } from "../../store/store";
import { useEffect, useState } from "react";
import { Preloader } from "../preloader/Preloader";
import { BeerLazyCard } from "../BeerLazyCard/BeerLazyCard";
import { shallow } from "zustand/shallow";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import s from "./BeerLazyList.module.css";

export const BeerLazyList: React.FC = () => {
  const [isDeletedShow, setIsDeletedShow] = useState(false);
  const [isFetch, setIsFetch] = useState(false);

  const isLoading = useAppStore((state) => state.isLoading, shallow);

  const [
    getBeers,
    lastInFirstOut,

    visibleBeers,
    selectedBeers,
    removeSelectedBeer,
  ] = useLazyListStore(
    (state) => [
      state.getBeers,
      state.lastInFirstOut,

      state.visibleBeers,
      state.selectedBeers,
      state.removeSelectedBeer,
    ],
    shallow
  );

  useEffect(() => {
    getBeers();
  }, []);

  useEffect(() => {
    if (isFetch) {
      lastInFirstOut().then(() => setIsFetch(false));
    }
  }, [isFetch]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return function () {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = (e: any) => {
    const scrollHeight = e.target.documentElement.scrollHeight; //total page height including scroll
    const scrollTop = e.target.documentElement.scrollTop; //current scroll position from the top of the page
    const innerHeight = window.innerHeight; //the height of the visible area of ​​the page
    if (scrollHeight - (scrollTop + innerHeight) < 750 && scrollHeight > 2500) {
      setIsFetch(true);
    }
  };

  useEffect(() => {
    setIsDeletedShow(selectedBeers.length > 0);
  }, [selectedBeers.length]);

  const removeSelectedBeerHandler = () => {

    removeSelectedBeer();
  };

  const beerList = visibleBeers.map((b) => (
    <BeerLazyCard beerID={b.id} key={b.id} />
  ));

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className={s.bntsWrapper}>
        {isDeletedShow && (
          <Button
            onClick={removeSelectedBeerHandler}
            type="ghost"
            icon={<DeleteOutlined style={{ fontSize: "35px" }} />}
          />
        )}
      </div>
      <div>{beerList}</div>
    </>
  );
};

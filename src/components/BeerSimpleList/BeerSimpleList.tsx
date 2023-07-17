import { useAppStore, useSimpleListStore } from "../../store/store";
import React, { useEffect, useState } from "react";
import { Preloader } from "../preloader/Preloader";
import { shallow } from "zustand/shallow";
import { BeerSimpleCard } from "../BeerSimpleCard/BeerSimpleCard";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import s from './BeerSimpleList.module.css';

export const BeerSimpleList: React.FC = () => {
  const [isDeletedShow, setIsDeletedShow] = useState(false);


  const isLoading = useAppStore((state) => state.isLoading, shallow);

  const [
    visibleBeers,
    selectedBeers,
    currentPage,
    getBeers,
    removeSelectedBeer,
  ] = useSimpleListStore(
    (state) => [
      state.visibleBeers,
      state.selectedBeers,
      state.currentPage,
      state.getBeers,
      state.removeSelectedBeer,
    ],
    shallow
  );

  useEffect(() => {
    getBeers(currentPage);
  }, []);

  useEffect(() => {
    setIsDeletedShow(selectedBeers.length > 0);
  }, [selectedBeers.length]);

  const removeSelectedBeerHandler = () => removeSelectedBeer();

  const beerList = visibleBeers.map((b) => (
    <BeerSimpleCard beerID={b.id} key={b.id} />
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

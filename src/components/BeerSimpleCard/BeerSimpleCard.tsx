import { Link } from "react-router-dom";
import { useSimpleListStore } from "../../store/store";
import { MouseEvent } from "react";
import s from "./BeerSimpleCard.module.css";
import { shallow } from "zustand/shallow";
import { AppMode } from "../../App";

export const BeerSimpleCard = ({ beerID }: BeerCardProps ) => {

  

  const [
    beer,
    isSelected,
    selectBeer
    ] = useSimpleListStore((state) => [
    state.visibleBeers.find((b) => beerID === b.id),
    state.selectedBeers.includes(beerID),
    state.selectBeer,
  ],shallow);

  const onRightClickHandler = (
    event: MouseEvent<HTMLAnchorElement>,
    beerID: number
  ) => {
    event.preventDefault();
    selectBeer(beerID);
  };

  if (!beer) {
    return <>NOT TIME TO DRINK</>;
  }

  return (
    <Link
    key={beer.id}
    to={`beer/${beer.id}`}
    onContextMenu={(event) => onRightClickHandler(event, beer.id)}
  >
    <div className={`${s.cardWrapper} ${isSelected ? s.selected : {}}`}>

      <div className={s.title}>{beer.name}</div>

      <div>
          <img
            src={beer.image_url}
            alt={beer.name}
            style={{ maxWidth: "20px" }}
          />
        </div>
    </div>

  </Link>
  );
};

type BeerCardProps = {
  beerID: number;

};

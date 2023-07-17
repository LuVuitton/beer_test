import s from "./BeerPage.module.css";
import { useLazyListStore, useSimpleListStore } from "../../store/store";
import { Divider, List, Typography } from "antd";
import { Image } from "antd";
import { useParams } from "react-router";
import { AppMode } from "../../App";
import { useEffect } from "react";


const { Title } = Typography;

export const BeerPage:React.FC<BeerPageProps> = ({appMode}) => {

useEffect(()=> {
  document.body.scrollIntoView({
    block: "start", 
    behavior: "smooth",
});
})
  
  let beer;
  const { beerID } = useParams();

  if (beerID) {
    if(appMode==='LAZY_SCROLL'){
    beer = useLazyListStore((state) => state.visibleBeers.find((b) => +beerID === b.id));
  } else {
    beer = useSimpleListStore((state) => state.visibleBeers.find((b) => +beerID === b.id));
  }
  }

  if (!beer) {
    return <>There is nothing</>;
  }

  return (
    <>
      <div>
        <div className={s.titleImg}>
          <Title>{beer.name}</Title>
          <Image width={150} style={{ padding: "20px" }} src={beer.image_url} />
        </div>

        <Divider orientation="center">Method</Divider>
        <div className={s.methods}>
          <p>
            Mash Temp: {beer.method.mash_temp[0].temp.value}{" "}
            {beer.method.mash_temp[0].temp.unit} for{" "}
            {beer.method.mash_temp[0].duration} minutes
          </p>
          <p>
            Fermentation Temp: {beer.method.fermentation.temp.value}{" "}
            {beer.method.fermentation.temp.unit}
          </p>
        </div>
        <Divider orientation="center">Brewers Tips</Divider>
        <p>{beer.brewers_tips}</p>

        <div className={s.lists}>
          <div className={s.list}>
            <Divider orientation="left">Hops</Divider>
            <List
              size="small"
              bordered
              dataSource={beer.ingredients.hops}
              renderItem={(item) => (
                <List.Item>
                  {item.name} - {item.amount.value} {item.amount.unit} (
                  {item.add} - {item.attribute}){" "}
                </List.Item>
              )}
            />
          </div>
          <div className={s.list}>
            <Divider orientation="left">Ingredients</Divider>
            <List
              size="small"
              bordered
              dataSource={beer.ingredients.malt}
              renderItem={(item) => (
                <List.Item>
                  {item.name} - {item.amount.value} {item.amount.unit}
                </List.Item>
              )}
            />
          </div>
          <div className={s.list}>
            <Divider orientation="left">Food Pairing</Divider>
            <List
              size="small"
              bordered
              dataSource={beer.food_pairing}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        </div>
      </div>
    </>
  );
};


type BeerPageProps = {
  appMode: AppMode
}
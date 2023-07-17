import { Beer } from './../store/apiResponsTypes';
import axios from "axios";



export const instance = axios.create({ baseURL: 'https://api.punkapi.com/v2/', })


export const beersAPI = {
    getBeers(page:number) {
        return instance.get<Beer[]>(`beers?page=${page}`)

    },

}

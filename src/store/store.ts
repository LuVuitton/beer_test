import { beersAPI } from "./../api/beersAPI";
import { create } from "zustand";
import { Beer } from "./apiResponsTypes";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

export const useAppStore = create<AppStore>((set) => ({
  isLoading: null,
  error: null,
  setLoading: (loadingStatus: boolean) => {
    set({ isLoading: loadingStatus });
  },
  setError: (error: string) => {
    set({ error: error });
  },
  clearStore: ()=> {
    useLazyListStore.setState({ // Очистить стейт второго стора
      beers: [],
      visibleBeers: [],
      selectedBeers: [],
      currentPage: 1,
    });
    useSimpleListStore.setState({
      beers: [],
      visibleBeers: [],
      selectedBeers: [],
      currentPage: 1,
    })
  }
}));

export const useSimpleListStore = create(
  devtools(
    immer<StateType & SimpleActions>((set, get) => ({
      beers: [],
      visibleBeers: [],
      selectedBeers: [],
      currentPage: 1,

      getBeers: async (page) => {
        useAppStore.getState().setLoading(true);
        try {
          const res = await beersAPI.getBeers(page);
          set((state) => {
            state.beers = res.data;
            state.visibleBeers = state.beers.splice(0, 15);
          });
        } catch (error: any) {
          useAppStore.getState().setError(error.message);
        } finally {
          useAppStore.getState().setLoading(false);
        }
      },

      selectBeer: (beerID) => {
        set((state) => {
          const selectedIdx = state.selectedBeers.indexOf(beerID);
          if (selectedIdx !== -1) {
            state.selectedBeers.splice(selectedIdx, 1);
          } else {
            state.selectedBeers.push(beerID);
          }
        });
      },

      removeSelectedBeer: () => {
        const { beers, visibleBeers, selectedBeers, getBeers } = get();
        if (
          beers.length === 0 &&
          selectedBeers.length === visibleBeers.length
        ) {
          set((state) => {
            state.currentPage = state.currentPage + 1;
            getBeers(state.currentPage);
          });
        } else {
          const updatedBeers = visibleBeers.filter(
            (beer) => !selectedBeers.includes(beer.id)
          );
          const removedBeers = beers.slice(0, selectedBeers.length);
          set((state) => {
            state.beers.splice(0, selectedBeers.length);
            state.visibleBeers = [...updatedBeers, ...removedBeers];
            state.selectedBeers = [];
          });
        }
      },
    }))
  )
);

export const useLazyListStore = create(
  devtools(
    immer<StateType & LazyActions>((set, get) => ({
      beers: [],
      visibleBeers: [],
      selectedBeers: [],
      currentPage: 1,
      getBeers: async () => {
        useAppStore.getState().setLoading(true);
        try {
          const res = await beersAPI.getBeers(get().currentPage);
          set((state) => {
            state.beers = res.data;
            state.visibleBeers = state.beers.splice(0, 15);
          });
        } catch (error: any) {
          useAppStore.getState().setError(error.message);
        } finally {
          useAppStore.getState().setLoading(false);
        }
      },
      selectBeer: (beerID) => {
        set((state) => {
          const selectedIdx = state.selectedBeers.indexOf(beerID);
          if (selectedIdx !== -1) {
            state.selectedBeers.splice(selectedIdx, 1);
          } else {
            state.selectedBeers.push(beerID);
          }
        });
      },
      lastInFirstOut: () => {

        const unrerenderState = useLazyListStore.getState();
        return new Promise<void>((resolve) => {
          if (unrerenderState.beers.length <= 10) {

            unrerenderState.getLazyBeers();
          } 
          set((state) => {
            const firstFive = state.beers.slice(0, 5);
            state.visibleBeers = [...state.visibleBeers, ...firstFive];
            state.beers = state.beers.slice(5);
            state.visibleBeers = state.visibleBeers.slice(5);
          });

          resolve();
        });
      },

      getLazyBeers: async () => {
        useAppStore.getState().setLoading(true);

        useLazyListStore.getState().currentPage = useLazyListStore.getState().currentPage + 1
        try {
          const res = await beersAPI.getBeers(useLazyListStore.getState().currentPage);

          set((state) => {
            state.beers = [...state.beers, ...res.data];
          });
        } catch (error: any) {
          useAppStore.getState().setError(error.message);
        } finally {
          useAppStore.getState().setLoading(false);
        }
      },

      removeSelectedBeer: () => {
        const unrerenderState = useLazyListStore.getState();
        const { beers, visibleBeers, selectedBeers } = get();

        const updatedBeers = visibleBeers.filter(
          (beer) => !selectedBeers.includes(beer.id)
        );
        const removedBeers = beers.slice(0, selectedBeers.length);
        set((state) => {
          state.beers.splice(0, selectedBeers.length);
          state.visibleBeers = [...updatedBeers, ...removedBeers];
          state.selectedBeers = [];
          if (state.beers.length < 10 || selectedBeers.length === visibleBeers.length) {

            unrerenderState.getLazyBeers();
          }
        });

      
      },
    }))
  )
);

type StateType = {
  beers: Beer[];
  visibleBeers: Beer[];
  selectedBeers: number[];
  currentPage: number;
};

type SimpleActions = {
  getBeers: (page: number) => void;
  selectBeer: (beerID: number) => void;
  removeSelectedBeer: () => void;
};

type LazyActions = {
  getBeers: () => void;
  selectBeer: (beerID: number) => void;
  lastInFirstOut: () => Promise<void>;
  getLazyBeers: () => void;
  removeSelectedBeer: () => void;
};

type AppStore = {
  isLoading: boolean | null;
  error: string | null;
  setLoading: (loadingStatus: boolean) => void;
  setError: (error: string) => void;
  clearStore:()=> void
};

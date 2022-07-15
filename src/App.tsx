import React from 'react';
import { Route, Routes } from 'react-router-dom';
import useLoadingData from './hooks/useLoadingData';
import Comments from './pages/Comments';
import FavoriteCards from './pages/FavoriteCards';
import PostList from './pages/PostList';
import { ICardData } from './types/ICard';

export const AppContext = React.createContext<{
  data: ICardData[];
  loading: boolean;
  refresh:() => Promise<void>;
  search: (query: string) => void;
  setData: React.Dispatch<React.SetStateAction<ICardData[]>>;
  filteredData: ICardData[];
  setFilteredData: React.Dispatch<React.SetStateAction<ICardData[]>>;
  favoriteIds: string[];
  setFavoriteIds: React.Dispatch<React.SetStateAction<string[]>>;
    }>({
      data: [],
      loading: false,
      refresh: async () => {},
      search: (query: string) => {},
      setData: (v: React.SetStateAction<ICardData[]>) => {},
      filteredData: [],
      setFilteredData: (v: React.SetStateAction<ICardData[]>) => {},
      favoriteIds: [],
      setFavoriteIds: (v: React.SetStateAction<string[]>) => {}
    });

function App () {
  const appHook =
    useLoadingData<ICardData>({
      initialData: [],
      fetchURL: 'https://jsonplaceholder.typicode.com/posts',
      filter: (query) => (posts) =>
        query
          ? posts.filter(
            (post) =>
                `#${post.id} ${post.title} ${post.body}`
                  .toLowerCase()
                  .indexOf(query.toLowerCase()) >= 0
          )
          : posts
    });
  return (
    <AppContext.Provider value={appHook}>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/favorite" element={<FavoriteCards />} />
        <Route path="/comments/:postId" element={<Comments />} />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;

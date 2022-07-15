import React, { useContext, useMemo } from 'react';
import PostCard from '../..//components/PostCard';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

function FavoriteCards () {
  const { favoriteIds, data } = useContext(AppContext);

  console.log('favorite ids', favoriteIds);

  const favoriteCardsData = useMemo(
    () => data.filter((card) => favoriteIds.some((id) => id === card.id)),
    [data, favoriteIds]
  );

  const navigator = useNavigate();

  return (
    <div className="flex flex-col items-center py-5">
      <h1 className='text-lg font-bold'>Favorite</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-5 mt-10">
        {favoriteCardsData.slice(0, 10).map((card) => (
          <PostCard
            key={card.id}
            id={card.id}
            title={card.title}
            body={card.body}
            loading={false}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20
        }}
      >
        <Button
          type="primary"
          ghost={true}
          onClick={() => navigator('/')}
        >
          Home
        </Button>
      </div>
    </div>
  );
}

export default FavoriteCards;

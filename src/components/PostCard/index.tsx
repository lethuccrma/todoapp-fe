import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { PostCardStyled } from './styled';

const PostCard: React.FC<{
  id: string;
  title: string;
  body: string;
  loading?: boolean;
}> = ({ id, title, body, loading = false }) => {
  const { favoriteIds, setFavoriteIds } = useContext(AppContext);
  const navigator = useNavigate();

  const handleFavoriteClick = (e: any) => {
    e.stopPropagation();
    setFavoriteIds((preIds) => preIds.some((preId) => preId === id) ? preIds.filter((preId) => preId !== id) : [...preIds, id]);
  };

  // eslint-disable-next-line multiline-ternary
  return loading ? (
    <Card loading={loading} style={{ width: 300 }} />
  ) : (
    <PostCardStyled onClick={() => navigator(`/comments/${id}`)}>
      <div>
        <p className='title'>
          {title}
        </p>
        <p className='body'>
          {body}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleFavoriteClick}>
          {favoriteIds.some((fid) => fid === id) ? <HeartFilled style={{ color: 'red', fontSize: 20 }}/> : <HeartOutlined style={{ fontSize: 20 }} />}
        </button>
      </div>
    </PostCardStyled>
  );
};

export default PostCard;

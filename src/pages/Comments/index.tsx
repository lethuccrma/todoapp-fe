import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Comment, List, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { CommentsStyled } from './styled';

type IComment = {
  postId: string;
  id: string;
  name: string;
  email: string;
  body: string;
}

function Comments () {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);

  const { favoriteIds } = useContext(AppContext);

  const navigator = useNavigate();

  useEffect(() => {
    setLoading(true);
    try {
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`).then<IComment[]>(response => response.json()).then((comments) => {
        setComments(comments);
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
    }
  }, [postId]);

  const dataRender = useMemo(() => comments.map(comment => ({
    author: comment.name,
    avatar: 'https://secure.gravatar.com/avatar/10e01473a5dd46f8aad531773c96ca07?s=256&d=mm&r=g',
    content: (
      <p>{comment.body}</p>
    )
  })), [comments]);

  return (
    <Spin tip="Loading..." spinning={loading}>
      <CommentsStyled>
        <div className='header'><h1 className="text-lg font-bold">Comments</h1></div>
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20
          }}
        >
          <Button type="primary" ghost={true} onClick={() => navigator('/')}>
            Home
          </Button>
          <Badge className='ml-5' size="default" count={favoriteIds.length}>
            <Button
              type="primary"
              ghost={true}
              onClick={() => navigator('/favorite')}
            >
              Favorite
            </Button>
          </Badge>
        </div>
        <List
          className="comment-list mt-5"
          header={`${comments.length} replies`}
          itemLayout="horizontal"
          dataSource={dataRender}
          renderItem={item => (
            <li>
              <Comment
                author={item.author}
                avatar={item.avatar}
                content={item.content}
              />
            </li>
          )}
        />
      </CommentsStyled>
    </Spin>
  );
}

export default Comments;

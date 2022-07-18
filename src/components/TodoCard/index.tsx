import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoCardStyled } from './styled';

const TodoCard: React.FC<{
  id: string;
  title: string;
  body: string;
  completed: boolean;
  loading?: boolean;
}> = ({ id, title, body, completed, loading = false }) => {
  const navigator = useNavigate();

  const handleCompleteClick = (e: any) => {
    e.stopPropagation();
    // TODO: handle make complete
  };

  // eslint-disable-next-line multiline-ternary
  return loading ? (
    <Card loading={loading} style={{ width: 300 }} />
  ) : (
    <TodoCardStyled onClick={() => navigator(`/comments/${id}`)}>
      <div>
        <p className='title'>
          {title}
        </p>
        <p className='body'>
          {body}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleCompleteClick}>
          {completed ? <CheckCircleFilled style={{ color: 'green', fontSize: 20 }}/> : <CheckCircleOutlined style={{ fontSize: 20 }} />}
        </button>
      </div>
    </TodoCardStyled>
  );
};

export default TodoCard;

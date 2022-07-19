import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { CardStatus, ICardData } from '../../types/ICard';
import { TodoCardStyled } from './styled';

const TodoCard: React.FC<ICardData & {
  loading?: boolean;
}> = ({ title, content, status, loading = false }) => {

  const handleCompleteClick = (e: any) => {
    e.stopPropagation();
    // TODO: handle make complete
  };

  // eslint-disable-next-line multiline-ternary
  return loading ? (
    <Card loading={loading} style={{ width: 300 }} />
  ) : (
    <TodoCardStyled>
      <div>
        <p className='title'>
          {title}
        </p>
        <p className='body'>
          {content}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleCompleteClick}>
          {status === CardStatus.COMPLETED ? <CheckCircleFilled style={{ color: 'green', fontSize: 20 }}/> : <CheckCircleOutlined style={{ fontSize: 20 }} />}
        </button>
      </div>
    </TodoCardStyled>
  );
};

export default TodoCard;

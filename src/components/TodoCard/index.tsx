import {
  CheckCircleFilled,
  CheckOutlined,
  EditFilled,
  DeleteFilled,
} from '@ant-design/icons';
import { Button, Card, Space, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { CardStatus, ICardData } from '../../types/ICard';
import { options } from '../TodoModal';
import { TodoCardStyled } from './styled';

const TodoCard: React.FC<
  ICardData & {
    loading?: boolean;
    onCompleteClick: (todo: ICardData) => void;
    onDeleteClick: (todo: ICardData) => void;
    onEditClick: (todo: ICardData) => void;
  }
> = (props) => {
  const {
    loading = false,
    onCompleteClick,
    onDeleteClick,
    onEditClick,
    ...todo
  } = props;

  const {
    id,
    dueDate,
    categories,
    title,
    content,
    status,
  } = todo;

  const handleCompleteClick = (e: any) => {
    e.stopPropagation();
    onCompleteClick({
      id,
      status:
        status === CardStatus.COMPLETED
          ? CardStatus.OPEN
          : CardStatus.COMPLETED,
    });
  };

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    onDeleteClick({
      id,
    });
  };

  const handleEditClick = (e: any) => {
    e.stopPropagation();
    onEditClick(todo);
  };

  // eslint-disable-next-line multiline-ternary
  return loading ? (
    <Card loading={loading} style={{ width: 300 }} />
  ) : (
    <TodoCardStyled>
      <div>
        <p className="title">{title}</p>
        <p className="body">{content}</p>
      </div>
      <Space>
        {(categories || '')
          .split(',')
          .filter((s) => s.length > 0)
          .map((category) => (
            <Tag
              key={category}
              color={
                options.find((o) => o.value === category)?.color || 'orange'
              }
            >
              {category}
            </Tag>
          ))}
      </Space>
      <div className="flex justify-between items-center mt-5">
        <div className="text-xs text-slate-400">
          {moment(dueDate).format('MM/DD/YYYY')}
        </div>
        <div className="flex text-sm">
          <Button onClick={handleDeleteClick} icon={<DeleteFilled className='text-red-400' />} className="border-none" />
          <Button onClick={handleEditClick} icon={<EditFilled />} className="border-none ml-2" />
          <Button
            onClick={handleCompleteClick}
            icon={
              status === CardStatus.COMPLETED ? (
                <CheckCircleFilled className="text-green-700" />
              ) : (
                <CheckOutlined />
              )
            }
            className="border-none ml-2"
          />
        </div>
      </div>
    </TodoCardStyled>
  );
};

export default TodoCard;

import React, { useCallback, useState } from 'react';
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Switch,
  Tag,
} from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { CardStatus, ICardData } from '../../types/ICard';
import useTodos from './hook';
import TodoCard from '../../components/TodoCard';
import moment from 'moment';
import TodoModal, { ICardForm } from '../../components/TodoModal';

const { Search } = Input;

const dummyData = (() => {
  const array = Array<ICardData>(10).fill({
    id: '-1',
    title: 'none',
    content: 'none',
    createdBy: 'none',
    categories: '',
    status: CardStatus.OPEN,
    dueDate: new Date(),
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  return array.map(
    (v, ind): ICardData => ({
      ...v,
      id: ind.toString(),
    }),
  );
})();

function TodoList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const handleAddCardSubmit = (value: ICardForm) => {
    console.log("🚀 ~ file: index.tsx ~ line 52 ~ handleAddCardSubmit ~ value", value);
    setModalVisible(false);
  };

  /* Fetching todo */
  const { todos, loading, error, refetch, pagination } = useTodos({
    page,
    take: pageSize,
  });

  /* Search */
  const search = (txt: string) => console.log(txt);
  const debounceSearch = useCallback(_.debounce(search, 500), []);

  return (
    <div className="flex flex-col items-center py-5">
      <Search
        style={{
          width: '500px',
        }}
        placeholder="Wanna search something for your boring life?"
        onSearch={search}
        onChange={(event: any) => debounceSearch(event.target.value)}
      />
      <Button
        style={{
          marginTop: 20,
        }}
        loading={false}
        type="primary"
        ghost
        onClick={() => {
          setModalVisible(true);
        }}
      >
        Add more todo
      </Button>
      {todos.length === 0 ? (
        <Empty className="m-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-5">
          {loading
            ? dummyData.map((v) => (
                <TodoCard key={v.id} {...v} loading={true} />
              ))
            : todos.map((v) => <TodoCard key={v.id} {...v} loading={false} />)}
        </div>
      )}
      <Pagination
        onChange={(newPage) => setPage(newPage)}
        className="mt-10"
        current={page}
        defaultPageSize={pageSize}
        total={pagination.total}
        disabled={loading}
        responsive
      />
      <TodoModal 
        onSubmit={handleAddCardSubmit}
        onClose={() => setModalVisible(false)}
        initialValues={{
          title: '',
          content: '',
          dueDate: new Date(),
          createdBy: '',
          categories: '',
          status: CardStatus.OPEN,
          id: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }}
        modalVisible={modalVisible}
      />
    </div>
  );
}

export default TodoList;

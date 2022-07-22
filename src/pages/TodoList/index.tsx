import React from 'react';
import { useCallback, useState } from 'react';
import { Avatar, Button, Dropdown, Empty, Image, Input, Menu, Pagination } from 'antd';
import _ from 'lodash';
import { CardStatus, ICardData } from '../../types/ICard';
import useTodos from './hook';
import TodoCard from '../../components/TodoCard';
import TodoModal, { ICardForm } from '../../components/TodoModal';
import AuthorizedAPI from '../../apis/authorized';
import { ADD_TODO, DELETE_TODO, EDIT_TODO } from '../../configs/server';
import { useSelector } from 'react-redux';
import IUser from '../../types/IUser';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux/auth/auth.saga';

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
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [editedTodo, setEditedTodo] = useState<ICardData>();
  const userState = useSelector<{user: IUser}, IUser>((state) => state.user);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const handleTodoSubmit = (value: ICardForm) => {
    setRequesting(true);

    if (!editedTodo) {
      // add todo
      AuthorizedAPI.post<
        { addedTodo: ICardData },
        { addedTodo: ICardData },
        ICardData
      >(ADD_TODO, {
        title: value.title,
        content: value.content,
        dueDate: value.dueDate.toDate(),
        status: CardStatus.OPEN,
        categories: value.categories.join(','),
      })
        .then((res) => {
          setModalVisible(false);
          refetch(true);
        })
        .catch((err) => {
          setRequestError(err?.response?.data?.message || err.message);
        })
        .finally(() => {
          setRequesting(false);
        });
    } else {
      // edit todo
      AuthorizedAPI.patch<any, any, ICardData>(`${EDIT_TODO}/${value.id}`, {
        title: value.title,
        content: value.content,
        dueDate: value.dueDate.toDate(),
        status: CardStatus.OPEN,
        categories: value.categories.join(','),
      })
        .then((res) => {
          setModalVisible(false);
          refetch(true);
        })
        .catch((err) => {
          setRequestError(err?.response?.data?.message || err.message);
        })
        .finally(() => {
          setRequesting(false);
        });
    }
  };

  const openTodoModal = () => {
    setRequesting(false);
    setRequestError('');
    setModalVisible(true);
  };

  const markTodoComplete = (todo: ICardData) => {
    AuthorizedAPI.patch(`${EDIT_TODO}/${todo.id}`, { status: todo.status })
      .then(() => {
        refetch(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteTodo = (todo: ICardData) => {
    AuthorizedAPI.delete(`${DELETE_TODO}/${todo.id}`)
      .then(() => {
        refetch(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEditTodoClick = (todo: ICardData) => {
    setEditedTodo(todo);
    openTodoModal();
  };

  const handleAddTodoClick = () => {
    setEditedTodo(undefined);
    openTodoModal();
  }

  /* Fetching todo */
  const { todos, loading, error, refetch, pagination } = useTodos({
    page,
    take: pageSize,
  });

  /* Search */
  const search = (txt: string) => {
    refetch(false, txt);
  };
  const debounceSearch = useCallback(_.debounce(search, 500), []);

  const handleLogout = () => {
    dispatch(LOGOUT());
  }

  const menu = (
    <Menu
      items={[
        {
          label: <a className='mx-5' href="/user">Profile</a>,
          key: '0',
        },
        {
          label: <div onClick={handleLogout} className='mx-5'>Logout</div>,
          key: '1',
        },
      ]}
    />
  );

  return (
    <div className="flex flex-col items-center py-5">
      <Dropdown overlay={menu} trigger={['click']} className="absolute top-5 right-5" >
        <a onClick={e => e.preventDefault()}>
          <Avatar src={userState.avatarURL || "https://joeschmoe.io/api/v1/random"} size={50} />
        </a>
      </Dropdown>
      <Search
        className='w-2/4'
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
        onClick={handleAddTodoClick}
      >
        Add more todo
      </Button>
      {todos.length === 0 ? (
        <Empty className="m-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-5">
          {loading
            ? dummyData.map((v) => (
                <TodoCard
                  key={v.id}
                  {...v}
                  onCompleteClick={markTodoComplete}
                  loading={true}
                  onDeleteClick={deleteTodo}
                  onEditClick={handleEditTodoClick}
                />
              ))
            : todos.map((v) => (
                <TodoCard
                  key={v.id}
                  {...v}
                  onCompleteClick={markTodoComplete}
                  loading={false}
                  onDeleteClick={deleteTodo}
                  onEditClick={handleEditTodoClick}
                />
              ))}
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
        onSubmit={handleTodoSubmit}
        onClose={() => setModalVisible(false)}
        initialValues={
          editedTodo || {
            title: '',
            content: '',
            dueDate: new Date(),
            createdBy: '',
            categories: '',
            status: CardStatus.OPEN,
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
        todoId={editedTodo?.id}
        modalVisible={modalVisible}
        loading={requesting}
        error={requestError}
        header={editedTodo ? 'Edit Todo' : 'Add Todo'}
      />
    </div>
  );
}

export default TodoList;

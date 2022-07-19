import React, { useCallback, useState } from 'react';
import { Button, DatePicker, Empty, Form, Input, Modal, Pagination, Select, Switch, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { CardStatus, ICardData } from '../../types/ICard';
import useTodos from './hook';
import TodoCard from '../../components/TodoCard';
import moment from 'moment';

const { Search } = Input;

const dummyData = (() => {
  const array = Array<ICardData>(10).fill({
    id: '-1',
    title: 'none',
    content: 'none',
    createdBy: 'none',
    category: "none",
    status: CardStatus.OPEN,
    dueDate: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date()
  });

  return array.map(
    (v, ind): ICardData => ({
      ...v,
      id: ind.toString(),
    }),
  );
})();

const options = [{ value: 'work', color: 'gold', label: 'Work' }, { value: 'study', color: 'lime', label: 'Study' }, { value: 'relax', color: 'green', label: 'Relax' }, { value: 'heath', color: 'cyan', label: 'Heath' }];
const tagRender = (props: CustomTagProps & {color?: string}) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={options.find((v) => v.value === value)?.color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

function TodoList() {

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const handleAddCard = () => {
    form.submit();
  };

  const handleAddCardSubmit = ({
    title,
    content,
    categories,
    dueDate,
  }: {
    title: string;
    content: string;
    categories: any;
    dueDate: any;
  }) => {
    console.log(title, content, categories, dueDate);
    setModalVisible(false);
  };

  /* Fetching todo */
  const {todos, loading, error, refetch, pagination} = useTodos({page, take: pageSize});

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
          form.resetFields();
        }}
      >
        Add more todo
      </Button>
      {todos.length === 0 ? <Empty className='m-10' /> :<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-5">
        {loading ? dummyData.map((v) => <TodoCard key={v.id} {...v} loading={true} />) : todos.map((v) => <TodoCard key={v.id} {...v} loading={false} />)}
      </div>}
      <Pagination className='mt-10' current={page} defaultPageSize={pageSize} total={pagination.total} disabled={loading} responsive />

      <Modal
        title="New Card"
        visible={modalVisible}
        onOk={handleAddCard}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{ ghost: true, type: 'primary' }}
        cancelButtonProps={{ danger: true, type: 'primary' }}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={handleAddCardSubmit}
          initialValues={{
            title: '',
            content: '',
            dueDate: moment(),
            categories: [],
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please input the content!' }]}
          >
            <Input.TextArea rows={4} className="resize-none" />
          </Form.Item>
          <Form.Item label="Due date" name="dueDate">
            <DatePicker />
          </Form.Item>
          {/* <Form.Item label="Done" name="isDone">
            <Switch defaultChecked={false} />
          </Form.Item> */}
          <Form.Item label="Categories" name="categories">
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={options}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TodoList;

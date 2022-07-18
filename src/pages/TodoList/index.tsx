import React, { useCallback, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { ICardData } from '../../types/ICard';

const { Search } = Input;

const dummyData = (() => {
  const array = Array<ICardData>(10).fill({
    id: '-1',
    title: 'none',
    body: 'none',
  });

  return array.map(
    (v, ind): ICardData => ({
      id: ind.toString(),
      title: 'dummy title',
      body: 'dummy title',
    }),
  );
})();

function TodoList() {

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const navigator = useNavigate();

  const handleAddCard = () => {
    form.submit();
  };

  const handleAddCardSubmit = ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    // TODO: add todo card
    setModalVisible(false);
  };

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
        onClick={() => setModalVisible(true)}
      >
        Add more todo
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-5">
        {/* TODO: Todo card */}
      </div>

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
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: 'Please input the body!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TodoList;

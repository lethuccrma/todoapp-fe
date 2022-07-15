import React, { useContext, useState } from 'react';
import PostCard from '../..//components/PostCard';
import { Badge, Button, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { ICardData } from '../../types/ICard';
import { AppContext } from '../../App';
// import _ from 'lodash';

const { Search } = Input;

const dummyData = (() => {
  const array = Array<ICardData>(10).fill({
    id: '-1',
    title: 'none',
    body: 'none'
  });

  return array.map(
    (v, ind): ICardData => ({
      id: ind.toString(),
      title: 'dummy title',
      body: 'dummy body'
    })
  );
})();

function PostList () {
  const { loading, search, setData, filteredData, setFilteredData, favoriteIds } = useContext(AppContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const navigator = useNavigate();

  const handleAddCard = () => {
    form.submit();
  };

  const handleAddCardSubmit = ({
    title,
    body
  }: {
    title: string;
    body: string;
  }) => {
    setFilteredData((pre) => [
      {
        id: new Date().getTime().toString(),
        title,
        body
      },
      ...pre
    ]);
    setData((pre) => [
      {
        id: new Date().getTime().toString(),
        title,
        body
      },
      ...pre
    ]);
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center py-5">
      <Search
        style={{
          width: '500px'
        }}
        placeholder="Wanna search something for your boring life?"
        onSearch={search}
        onChange={(event) => _.debounce(search, 500)(event.target.value)}
      />
      {/* <Button
        style={{
          marginTop: 20
        }}
        type="primary"
        loading={loading}
        ghost={true}
        onClick={refresh}
      >
        Refresh
      </Button> */}
      <Button
        style={{
          marginTop: 20
        }}
        loading={loading}
        type="primary"
        ghost={true}
        onClick={() => setModalVisible(true)}
      >
        Add more card
      </Button>
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20
        }}
      >
        <Badge size="default" count={favoriteIds.length}>
          <Button
            type="primary"
            ghost={true}
            onClick={() => navigator('/favorite')}
          >
            Favorite
          </Button>
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-5">
        {(loading ? dummyData : filteredData.slice(0, 10)).map((card) => (
          <PostCard
            key={card.id}
            id={card.id}
            title={card.title}
            body={card.body}
            loading={loading}
          />
        ))}
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

export default PostList;

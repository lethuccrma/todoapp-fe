import { DatePicker, Form, Input, Modal, Select, Tag, Typography } from 'antd';
import React, { useEffect } from 'react';
import { ICardData } from '../../types/ICard';
import { TodoModalStyled } from './styled';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import moment, { Moment } from 'moment';

const { Text } = Typography;

export const options = [
  { value: 'work', color: 'gold', label: 'Work' },
  { value: 'study', color: 'lime', label: 'Study' },
  { value: 'relax', color: 'green', label: 'Relax' },
  { value: 'health', color: 'cyan', label: 'Health' },
];
const tagRender = (props: CustomTagProps & { color?: string }) => {
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

export type ICardForm = {
  id?: string;
  title: string;
  content: string;
  dueDate: Moment;
  categories: string[];
};

const TodoModal: React.FC<{
  onSubmit: (value: ICardForm) => void;
  onClose: () => void;
  initialValues: ICardData;
  modalVisible: boolean;
  loading: boolean;
  header: string;
  error: string;
  todoId?: string;
}> = ({
  onClose,
  onSubmit,
  initialValues,
  modalVisible,
  loading,
  error,
  header,
  todoId
}) => {
  const [form] = Form.useForm();

  const handleOkPress = () => {
    form.submit();
  };

  const handleFormSubmit = (value: ICardForm) => {
    onSubmit({...value, id: todoId});
  };

  useEffect(() => form.resetFields(), [initialValues]);

  return (
    <TodoModalStyled>
      <Modal
        title={header}
        visible={modalVisible}
        onOk={handleOkPress}
        onCancel={onClose}
        okButtonProps={{ ghost: true, type: 'primary' }}
        cancelButtonProps={{ danger: true, type: 'primary' }}
        confirmLoading={loading}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{
            title: initialValues.title,
            content: initialValues.content,
            dueDate: moment(initialValues.dueDate),
            categories: initialValues.categories
              ?.split(',')
              .filter((s) => s.length > 0),
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
        <Text className="text-red-500">{error}</Text>
      </Modal>
    </TodoModalStyled>
  );
};

export default TodoModal;

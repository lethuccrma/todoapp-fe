import { Button, Col, Form, Input, Row, Space, Typography, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './index.css';
import UnauthorizedAPI from '../../apis/unauthorized';
import {
  GET_FILE,
  GET_USER,
  ROOT_ENDPOINT,
  SIGNUP,
} from '../../configs/server';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthState } from '../../redux/auth/auth.slice';
import UserSlice from '../../redux/user/user.slice';
import IUser from '../../types/IUser';
import AuthorizedAPI from '../../apis/authorized';
import { useDispatch } from 'react-redux';

export default function index() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [onLoading, setOnLoading] = useState(false);
  const [ErrorText, setErrorText] = useState('');
  const [onChangingPassword, setOnChangingPassword] = useState(false);
  const [onEditingInfo, setOnEditingInfo] = useState(false);

  const authState = useSelector<{ auth: AuthState }, AuthState>(
    (state) => state.auth,
  );
  const userState = useSelector<{ user: IUser }, IUser>((state) => state.user);

  useEffect(() => {
    AuthorizedAPI.get(GET_USER)
      .then((res) => {
        console.log(res.data.user);
        setErrorText('');
        dispatch(UserSlice.actions.setUser(res.data.user));
      })
      .catch((err) => {
        setErrorText(err.response.data.message || err.message);
      })
      .finally(() => {
        setOnLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <Image
        className="mb-8"
        width={200}
        src={`${ROOT_ENDPOINT}${GET_FILE}/${userState.avatar}?token=Bearer ${authState.token}`}
        fallback={require('./BlankImage.png')}
        placeholder={
          <Image
            preview={false}
            src={require('./BlankImage.png')}
            width={200}
          />
        }
      />
      <Form
        form={form}
        name="UserInfo"
        initialValues={{
          firstName: userState.firstName,
          lastName: userState.lastName,
          email: userState.email,
          createdAt: userState.createdAt,
          updatedAt: userState.updatedAt,
        }}
        scrollToFirstError
        className="info-form min-w-[40%]"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Typography>First name:</Typography>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Missing first name' }]}
            >
              <Input disabled={!onEditingInfo} placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Typography>Last name:</Typography>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Missing last name' }]}
            >
              <Input
                disabled={!onEditingInfo}
                placeholder="Last Name"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Typography>Email:</Typography>
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid email!',
                },
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input
                disabled={!onEditingInfo}
                placeholder="Email"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Typography>Created at:</Typography>
            <Form.Item
              name="createdAt"
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Typography>Updated at:</Typography>
            <Form.Item
              name="updatedAt"
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={onEditingInfo ? "info-form-button" :"info-form-button hidden"}
            loading={onLoading}
          >
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

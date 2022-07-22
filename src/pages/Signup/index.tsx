import { Button, Col, Form, Input, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './index.css';
import UnauthorizedAPI from '../../apis/unauthorized';
import { SIGNUP } from '../../configs/server';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthState } from '../../redux/auth/auth.slice';

export default function index() {
  const [form] = Form.useForm();

  const [onLoading, setOnLoading] = useState(false);

  const [ErrorText, setErrorText] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);

  const authState = useSelector<{ auth: AuthState }, AuthState>(
    (state) => state.auth,
  );

  useEffect(() => {
    if (ErrorText) {
      setShowErrorText(true);
      setTimeout(() => {
        setShowErrorText(false);
        setErrorText('');
      }, 3000);
    }
  }, [ErrorText]);

  useEffect(() => {
    if (authState.authenticated) navigate('/');
  }, [authState.authenticated]);

  const navigate = useNavigate();
  const onFinish = (values: any) => {
    const { email, password, firstName, lastName } = values;
    setOnLoading(true);
    UnauthorizedAPI.post(SIGNUP, { email, password, firstName, lastName })
      .then((res) => {
        setErrorText('');
        navigate('/login');
      })
      .catch((err) => {
        setErrorText(err.response.data.message || err.message);
      })
      .finally(() => {
        setOnLoading(false);
      });
  };

  return (
    <div className="flex h-screen w-screen justify-center	 items-center">
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{ remember: true }}
        scrollToFirstError
        className="signup-form min-w-[40%]"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Missing first name' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Missing last name' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
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
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            { type: 'string', min: 6 },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        {showErrorText ? (
          <Typography style={{ color: 'red', marginBottom: 10 }}>
            {ErrorText}
          </Typography>
        ) : (
          <div></div>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="signup-form-button"
            loading={onLoading}
          >
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AuthSlice, { AuthState } from '../../redux/auth/auth.slice';
import { LoginRequest } from '../../types/Axios';
import AuthSaga from '../../redux/auth/auth.saga';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import './index.css';
import { stringify } from 'querystring';
import { useNavigate } from 'react-router-dom';

export default function index() {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const authState = useSelector<{ auth: AuthState }, AuthState>(
    (state) => state.auth,
  );

  const onFinish = (data: LoginRequest) => {
    dispatch(AuthSlice.actions.startLogin(data));
  };

  // useEffect(() => {
  //   authState.
  // }, []);

  useEffect(() => {
    if (authState.loginError) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [authState.loginError]);

  useEffect(() => {
    if (authState.authenticated) navigate('/');
  }, [authState.authenticated]);

  return (
    <div className="flex h-screen w-screen justify-center	 items-center">
      <Form
        name="normal_login"
        className="login-form min-w-[25%]"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Typography>Your email:</Typography>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="example@gmail.com"
          />
        </Form.Item>
        <Typography>Your password:</Typography>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { type: 'string', min: 6 },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {/* <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item> */}
        {showError ? (
          <Typography style={{ color: 'red', marginBottom: 10 }}>
            {authState.loginError}
          </Typography>
        ) : (
          <div></div>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={authState.loginPending}
          >
            Log in
          </Button>
          Or <a href="/signup">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
}

import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Image,
  Modal,
} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import './index.css';
import UnauthorizedAPI from '../../apis/unauthorized';
import {
  CHANGE_PASSWORD,
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
import Password from 'antd/lib/input/Password';

function ShowInfo(props: object) {
  return <Typography>Updated at:</Typography>;
}

export default function index() {
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const dispatch = useDispatch();

  const [onLoading, setOnLoading] = useState(false);
  const [ErrorText, setErrorText] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);
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

  useEffect(() => {
    if (ErrorText) {
      setShowErrorText(true);
      setTimeout(() => {
        setShowErrorText(false);
        setErrorText('');
      }, 3000);
    }
  }, [ErrorText]);

  const changePassworsModelHander = () => {
    changePasswordForm.submit();
  };

  const changePasswordHandler = (values: any) => {
    const { oldPassword, password } = values;
    console.log(values);
    setOnLoading(true);
    AuthorizedAPI.patch(CHANGE_PASSWORD, {
      oldPassword,
      newPassword: password,
    })
      .then((res) => {
        setErrorText('');
        console.log(res.data);
        UserSlice.actions.setUser(res.data.user);
        setOnChangingPassword(false);
      })
      .catch((err) => {
        setErrorText(err.response.data.message || err.message);
      })
      .finally(() => {
        setOnLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <Modal
        title="Change password"
        visible={onChangingPassword}
        onOk={changePassworsModelHander}
        onCancel={() => setOnChangingPassword(false)}
        okButtonProps={{ ghost: true, type: 'primary' }}
        cancelButtonProps={{ danger: true, type: 'primary' }}
      >
        <Form
          name="normal_login"
          className="login-form min-w-[25%]"
          onFinish={changePasswordHandler}
          form={changePasswordForm}
        >
          <Form.Item
            name="oldPassword"
            rules={[
              {
                required: true,
                message: 'Please input your old password!',
              },
              { type: 'string', min: 6 },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Old password" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
              { type: 'string', min: 6 },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="New password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          {showErrorText ? (
            <Typography style={{ color: 'red', marginBottom: 10 }}>
              {ErrorText}
            </Typography>
          ) : (
            <div></div>
          )}
        </Form>
      </Modal>
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
          createdAt: moment(userState.createdAt).format('DD/MM/YYYY HH:mm:ss'),
          updatedAt: moment(userState.updatedAt).format('DD/MM/YYYY HH:mm:ss'),
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
              <Input disabled={!onEditingInfo} placeholder="Last Name" />
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
              <Input disabled={!onEditingInfo} placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Typography>Created at:</Typography>
            <Form.Item name="createdAt">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Typography>Updated at:</Typography>
            <Form.Item name="updatedAt">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                // htmlType="submit"
                // className='info-form-button';
                loading={onLoading}
                onClick={() => setOnChangingPassword(true)}
              >
                Change password
              </Button>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={
                  onEditingInfo ? 'info-form-button' : 'info-form-button hidden'
                }
                loading={onLoading}
              >
                Sign up
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

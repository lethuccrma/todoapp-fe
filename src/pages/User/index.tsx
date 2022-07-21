import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Image as ImageAnt,
  Modal,
  UploadProps,
  Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import './index.css';
import UnauthorizedAPI from '../../apis/unauthorized';
import {
  CHANGE_PASSWORD,
  EDIT_USER,
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
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

function ChangePasswordModal(props: {
  setOnChangingPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onChangingPassword: boolean;
}) {
  const navigate = useNavigate();

  const [changePasswordForm] = Form.useForm();
  const { onChangingPassword, setOnChangingPassword } = props;
  const [onLoading, setOnLoading] = useState(false);
  const [ErrorText, setErrorText] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);

  useEffect(() => {
    if (ErrorText) {
      setShowErrorText(true);
      setTimeout(() => {
        setShowErrorText(false);
        setErrorText('');
      }, 3000);
    }
  }, [ErrorText]);

  const changePasswordModalHandler = () => {
    changePasswordForm.submit();
  };
  const changePasswordHandler = (values: any) => {
    const { oldPassword, password } = values;

    setOnLoading(true);
    setErrorText('');
    setShowErrorText(false);

    AuthorizedAPI.patch(CHANGE_PASSWORD, {
      oldPassword,
      newPassword: password,
    })
      .then((res) => {
        console.log(res.data);
        UserSlice.actions.setUser(res.data.user);

        setErrorText('');
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
    <Modal
      title="Change password"
      visible={onChangingPassword}
      confirmLoading={onLoading}
      onOk={changePasswordModalHandler}
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
          ]}
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
                  new Error('The two passwords that you entered do not match!'),
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
        ) : null}
      </Form>
    </Modal>
  );
}

function EditInfoModal(props: {
  setOnEditingInfo: React.Dispatch<React.SetStateAction<boolean>>;
  onEditingInfo: boolean;
  oldFirstName: string;
  oldLastName: string;
}) {
  const navigate = useNavigate();

  const [editInfoForm] = Form.useForm();
  const { onEditingInfo, setOnEditingInfo, oldFirstName, oldLastName } = props;
  const [onLoading, setOnLoading] = useState(false);
  const [ErrorText, setErrorText] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);

  useEffect(() => {
    if (ErrorText) {
      setShowErrorText(true);
      setTimeout(() => {
        setShowErrorText(false);
        setErrorText('');
      }, 3000);
    }
  }, [ErrorText]);

  const editInfoModalHandler = () => {
    editInfoForm.submit();
  };
  const editInfoHandler = (values: any) => {
    const { firstName, lastName } = values;

    console.log(values);

    setOnLoading(true);
    setErrorText('');
    setShowErrorText(false);

    AuthorizedAPI.patch(EDIT_USER, {
      firstName,
      lastName,
    })
      .then((res) => {
        console.log(res.data);

        UserSlice.actions.setUser(res.data.user);

        setErrorText('');
        setOnEditingInfo(false);
      })
      .catch((err) => {
        setErrorText(err.response.data.message || err.message);
      })
      .finally(() => {
        setOnLoading(false);
      });
  };
  return (
    <Modal
      title="Edit information"
      visible={onEditingInfo}
      confirmLoading={onLoading}
      onOk={editInfoModalHandler}
      onCancel={() => setOnEditingInfo(false)}
      okButtonProps={{ ghost: true, type: 'primary' }}
      cancelButtonProps={{ danger: true, type: 'primary' }}
    >
      <Form
        name="normal_login"
        className="login-form min-w-[25%]"
        onFinish={editInfoHandler}
        form={editInfoForm}
        initialValues={{
          firstName: oldFirstName,
          lastName: oldLastName,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Typography>First Name</Typography>
            <Form.Item name="firstName">
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Typography>Last Name</Typography>
            <Form.Item name="lastName">
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        {showErrorText ? (
          <Typography style={{ color: 'red', marginBottom: 10 }}>
            {ErrorText}
          </Typography>
        ) : null}
      </Form>
    </Modal>
  );
}

const handleUpload = (file: UploadFile) => {
  console.log(file);
  const formData = new FormData();
  formData.append('avatar', file as RcFile);
  AuthorizedAPI.patch(EDIT_USER, formData).then((res) => {
    console.log(res.data);

    UserSlice.actions.setUser(res.data.user);
  });
};

const ChangeAvatarProps: UploadProps = {
  name: 'avatar',
  showUploadList: false,
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  },
  beforeUpload: (file: UploadFile) => {
    handleUpload(file);
    return true;
  },
  onPreview: async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  },
};

export default function index() {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [onLoading, setOnLoading] = useState(false);
  const [ErrorText, setErrorText] = useState('');

  const [onChangingPassword, setOnChangingPassword] = useState(false);
  const [onChangingAvatar, setOnChangingAvatar] = useState(false);
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

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      {onChangingPassword ? (
        <ChangePasswordModal
          onChangingPassword={onChangingPassword}
          setOnChangingPassword={setOnChangingPassword}
        />
      ) : null}
      {onEditingInfo ? (
        <EditInfoModal
          onEditingInfo={onEditingInfo}
          setOnEditingInfo={setOnEditingInfo}
          oldFirstName={userState.firstName}
          oldLastName={userState.lastName}
        />
      ) : null}
      <ImageAnt
        className="mb-4"
        width={200}
        src={`${ROOT_ENDPOINT}${GET_FILE}/${userState.avatar}?token=Bearer ${authState.token}`}
        fallback={require('./BlankImage.png')}
        placeholder={
          <ImageAnt
            preview={false}
            src={require('./BlankImage.png')}
            width={200}
          />
        }
      />
      <Row className="mb-8">
        <Col span={8}>
          <ImgCrop rotate>
            <Upload {...ChangeAvatarProps}>
              <Button icon={<UploadOutlined />}>Change Avatar</Button>
            </Upload>
          </ImgCrop>
        </Col>
      </Row>
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
            <Form.Item name="firstName">
              <Input disabled placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Typography>Last name:</Typography>
            <Form.Item name="lastName">
              <Input disabled placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Typography>Email:</Typography>
            <Form.Item name="email">
              <Input disabled placeholder="Email" />
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

        <Row>
          <Col span={8}>
            <Form.Item>
              <Button
                type="primary"
                block
                onClick={() => setOnChangingPassword(true)}
              >
                Change password
              </Button>
            </Form.Item>
          </Col>
          <Col span={8} offset={8}>
            <Form.Item>
              <Button
                type="primary"
                block
                onClick={() => setOnEditingInfo(true)}
              >
                Edit Information
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

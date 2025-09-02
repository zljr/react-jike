import { Button, Card, Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { fetchLogin } from '@/store/modules/user';
import './index.scss';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    await dispatch(fetchLogin(values));
    navigate('/');
    message.success('登录成功');
  };
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        <Form
          validateTrigger="onBlur"
          onFinish={onFinish}
        >
          <Form.Item
            label="电话"
            name="mobile"
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input size="large" placeholder="请输入电话" allowClear />
          </Form.Item>
          <Form.Item
            label="验证码"
            name="code"
            rules={[{ required: true, message: '请输入验证码' }, { min: 6, message: '验证码长度不能少于 6 位' }, { pattern: /^\w+$/, message: '验证码只能包含字母、数字和下划线' },
            ]}
          >
            <Input size="large" placeholder="请输入验证码" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
export default Login;

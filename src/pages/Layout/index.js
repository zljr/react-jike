import {
  DiffOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, message, Popconfirm } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearUserInfo, fetchUserInfo } from '@/store/modules/user';

import './index.scss';

const { Header, Sider } = Layout;
const items = [
  {
    label: '首页',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: '文章管理',
    key: '/article',
    icon: <DiffOutlined />,
  },
  {
    label: '创建文章',
    key: '/publish',
    icon: <EditOutlined />,
  },
];

function GeekLayout() {
  const navigate = useNavigate();
  const onMenuClick = (route) => {
    const path = route.key;
    navigate(path);
  };
  // 获取当前路径
  const pathName = useLocation().pathname;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  const userInfo = useSelector(state => state.user.userInfo);
  const onConfirm = () => {
    dispatch(clearUserInfo());
    navigate('/login');
    message.success('登出登录成功');
  };
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="确认"
              cancelText="取消"
              onConfirm={onConfirm}
            >
              <LogoutOutlined />
              退出
            </Popconfirm>

          </span>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          className="site-layout-background"
        >
          <Menu
            mode="inline"
            theme="dark"
            onClick={onMenuClick}
            selectedKeys={[pathName]}
            items={items}
            style={{ height: '100%', borderRight: 0 }}
          >
          </Menu>
        </Sider>
        <Layout
          className="layout-content"
          style={{ padding: 20 }}
        >
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
}
export default GeekLayout;

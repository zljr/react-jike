import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, DatePicker, Form, Popconfirm, Radio, Select, Space, Table, Tag } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteArticleAPI, getArticleAPI } from '@/apis/article';
import img404 from '@/assets/error.png';
import { useChannel } from '@/hooks/useChannel';

const { Option } = Select;
const { RangePicker } = DatePicker;

function Article() {
  const { channelList } = useChannel();
  const navigate = useNavigate();
  // 定义状态枚举
  const status = {
    1: <Tag color="warning">待审核</Tag>,
    2: <Tag color="success">审核通过</Tag>,
  };
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: (cover) => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      // data - 后端返回的状态status 根据它做条件渲染
      // data === 1 => 待审核
      // data === 2 => 审核通过
      render: data => status[data],
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/publish?id=${data.id}`)} />
            <Popconfirm
              title="删除文章"
              description="确认要删除当前文章吗?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onConfirm(data.id)}
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const [reqData, setReqData] = useState({
    status: '',
    channel_id: '',
    begin_pubdate: '',
    end_pubdate: '',
    page: 1,
    per_page: 5,
  });
  useEffect(() => {
    async function getList() {
      const res = await getArticleAPI(reqData);
      setList(res.data.results);
      setCount(res.data.total_count);
    }
    getList();
  }, [reqData]);
  const onFinish = (formValue) => {
    setReqData({
      ...reqData,
      channel_id: formValue.channel_id,
      status: formValue.status,
      begin_pubdate: formValue.date[0].format('YYYY-MM-DD'),
      end_pubdate: formValue.date[1].format('YYYY-MM-DD'),
    });
  };
  const onPageChange = (page) => {
    setReqData({
      ...reqData,
      page,
    });
  };
  const onConfirm = async (id) => {
    await deleteArticleAPI(id);
    setReqData({
      ...reqData,
    });
  };
  return (
    <div>
      <Card
        title={(
          <Breadcrumb
            items={[
              { title: <Link to="/">首页</Link> },
              { title: '文章列表' },
            ]}
          />
        )}
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: null }} onFinish={onFinish}>
          <Form.Item
            label="状态"
            name="status"
          >
            <Radio.Group>
              <Radio value={null}>
                全部
              </Radio>
              <Radio value={1}>
                待审核
              </Radio>
              <Radio value={2}>
                审核通过
              </Radio>
            </Radio.Group>

          </Form.Item>
          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择频道"
              style={{ width: 120 }}
            >
              { channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )) }
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date">
            <RangePicker locale={locale} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        title={`根据条件筛选工查询到 ${count} 条结果 `}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{
            total: count,
            pageSize: reqData.per_page,
            current: reqData.page,
            onChange: onPageChange,
          }}
        />

      </Card>
    </div>
  );
}
export default Article;

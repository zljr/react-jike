import { PlusOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  message,
  Radio,
  Select,
  Space,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { Link, useSearchParams } from 'react-router-dom';
import { createArticleAPI, getArticleByIdAPI, updateArticleAPI } from '@/apis/article';
import { useChannel } from '@/hooks/useChannel';
import './index.scss';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
function Publish() {
  const { channelList } = useChannel();
  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e) => {
    setImageType(e.target.value);
  };
  const [imageList, setImageList] = useState([]);
  const onChange = (value) => {
    setImageList(value.fileList);
  };
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const onFinish = (formValue) => {
    if (imageType !== imageList.length) {
      message.warning('封面图片数量不匹配');
    }
    const { title, content, channel_id } = formValue;
    const reqData = {
      title,
      content,
      cover: {
        type: imageType,
        images: imageList.map((item) => {
          if (item.response) {
            return item.response.data.url;
          }
          else {
            return item.url;
          }
        }),
      },
      channel_id,
    };
    if (articleId) {
      updateArticleAPI({ ...reqData, id: articleId });
    }
    else {
      createArticleAPI(reqData);
    }
  };

  const [form] = Form.useForm();
  useEffect(() => {
    const getArticleById = async () => {
      const res = await getArticleByIdAPI(articleId);
      const data = res.data;
      form.setFieldsValue({
        ...data,
        type: data.cover.type,
      });
      setImageType(data.cover.type);
      setImageList(data.cover.images.map((url) => {
        return { url };
      }));
    };
    if (articleId) {
      getArticleById();
    }
  }, [articleId, form]);
  return (
    <div className="publish">
      <Card
        title={(
          <Breadcrumb
            items={[
              { title: <Link to="/">首页</Link> },
              { title: `${articleId ? '编辑文章' : '发布文章'} ` },
            ]}
          />
        )}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              { channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          </Form.Item>
          <Form.Item
            label="封面"
          >
            <Form.Item
              name="type"
            >
              <Radio.Group
                onChange={onTypeChange}
              >
                <Radio value={0}>无图</Radio>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
              </Radio.Group>

            </Form.Item>
            { imageType > 0 && (
              <Upload
                listType="picture-card"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                name="image"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            >

            </ReactQuill>
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 4 }}
          >
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>

      </Card>
    </div>
  );
}
export default Publish;

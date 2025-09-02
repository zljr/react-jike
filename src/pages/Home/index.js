import { Col, Row } from 'antd';
import BarChart from './components/BarChart';

function Home() {
  const title1 = '三大框架满意度';
  const title2 = '三大框架使用度';
  return (
    <div>
      <Row>
        <Col span={12}>
          <BarChart title={title1} />
        </Col>
        <Col span={12}>
          <BarChart title={title2} />
        </Col>
      </Row>
    </div>
  );
}
export default Home;

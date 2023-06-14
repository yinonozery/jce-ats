import React from 'react';
import { Button, Result, Divider } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import { useNavigate } from 'react-router-dom';

type errorProps = {
  statusCode: ResultStatusType | undefined,
  subTitle: string,
}

const Error: React.FC<errorProps> = (props) => {
  const navigate = useNavigate();
  return (
    <Result
      status={props.statusCode}
      title={<Divider style={{ fontSize: '25px' }}>{props.statusCode}</Divider>}
      subTitle={props.subTitle}
      extra={<Button type='primary' onClick={() => navigate('/')}>Back Home</Button>}
    />)
}

export default Error;
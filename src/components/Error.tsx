import React from 'react';
import { Button, Result, Divider } from 'antd';
import { ResultStatusType } from 'antd/es/result';

type errorProps = {
  statusCode: ResultStatusType | undefined,
  subTitle: string,
}

const Error: React.FC<errorProps> = (props) => (
  <Result
    status={props.statusCode}
    title={<Divider style={{ fontSize: '25px' }}>{props.statusCode}</Divider>}
    subTitle={props.subTitle}
    extra={<Button type="primary" onClick={() => document.location.href = '/'}>Back Home</Button>}
  />
);

export default Error;
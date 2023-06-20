import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal, Form, Button, Input, Select, Divider, InputNumber, message } from 'antd';
import Candidate from '../types/Candidate';
import { ManOutlined, WomanOutlined, LoadingOutlined, CloseCircleOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { EDIT_CANDIDATE_MSG, MISSING_FIELD, UPDATE_SUCCESS } from '../../utils/messages';
import dataStore from '../../stores/dataStore';

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>,
    candidate: Candidate | undefined,
}

const EditCandidate: React.FC<modalProps> = (props) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const saveCandidate = async () => {
        setIsLoading(true);
        const editedCandidate = await form.validateFields();
        for (const key in editedCandidate)
            if (props.candidate && editedCandidate.hasOwnProperty(key))
                props.candidate[key] = editedCandidate[key];


        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/candidates/${props.candidate?.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(props.candidate),
            });
            const data: any = await response.json();
            if (data.statusCode === 200) {
                message.success(UPDATE_SUCCESS('Candidate'))
                dataStore.fetchCandidatesData(true);
            }
            else
                throw data.error;
            form.resetFields();
            props.stateFunc(false);
        } catch (error: any) {
            message.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        form.resetFields()
        form.setFieldsValue(props.candidate)
    }, [form, props.candidate, props.state])

    return (
        <Modal
            open={props.state}
            onCancel={() => props.stateFunc(false)}
            footer={<Button type='primary' onClick={saveCandidate} loading={isLoading} block>Save</Button>}
            confirmLoading={false}
            title={<Divider>Edit Candidate: {props.candidate?.first_name} {props.candidate?.last_name}</Divider>}
            centered
        >
            <Form form={form}>
                <Form.Item name='first_name' label='First Name' rules={[
                    {
                        type: 'string',
                        required: true,
                        message: MISSING_FIELD('first name'),
                    },
                ]} required={false}>
                    <Input />
                </Form.Item>
                <Form.Item name='last_name' label='Last Name' rules={[
                    {
                        type: 'string',
                        required: true,
                        message: MISSING_FIELD('last name'),
                    },
                ]} required={false}>
                    <Input />
                </Form.Item>
                <Form.Item name='email' label='Email' rules={[
                    {
                        type: 'string',
                        required: true,
                        message: MISSING_FIELD('email'),
                    },
                ]} required={false}>
                    <Input />
                </Form.Item>
                <Form.Item name='work_experience' label='Work Experience'>
                    <InputNumber min={0} max={99} />
                </Form.Item>
                <Form.Item name='gender' label='Gender' required={false}>
                    <Select>
                        <Select.Option value='Male'><span>Male <ManOutlined /></span></Select.Option>
                        <Select.Option value='Female'><span>Female <WomanOutlined /></span></Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name='status' label='Status'>
                    <Select>
                        <Select.Option value='Available'><span>Available <ClockCircleOutlined style={{ color: 'blue', marginInlineStart: '5px' }} /></span></Select.Option>
                        <Select.Option value='Accepted'><span>Accepted <CheckCircleOutlined style={{ color: 'green', marginInlineStart: '5px' }} /></span></Select.Option>
                        <Select.Option value='In Progress'><span>In Progress <LoadingOutlined style={{ color: 'orange', marginInlineStart: '5px' }} /></span></Select.Option>
                        <Select.Option value='Rejected'><span>Rejected <CloseCircleOutlined style={{ color: 'red', marginInlineStart: '5px' }} /></span></Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name='comments' label='Additional Comments' required={false}>
                    <Input.TextArea rows={4} showCount maxLength={200} style={{ resize: 'none' }} />
                </Form.Item>
            </Form>
            <p style={{ color: 'gray', fontSize: '.85em', marginBlock: '40px 20px' }}>{EDIT_CANDIDATE_MSG}</p>
        </Modal >
    )
};

export default EditCandidate;
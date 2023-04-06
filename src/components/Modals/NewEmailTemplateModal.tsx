import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { Modal, Form, Input, message, Divider, Select, Space, Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { EMAIL_TEMPLATE_SUCCESS, FETCHING_DATA_FAILED, FIELD_MIN_LENGTH, MISSING_FIELD } from "../../utils/messages";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}


const EditProfileModal: React.FC<modalProps> = (props) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);
    const [newType, setNewType] = useState<string>('');
    const inputRef = useRef(null);

    const url = `${process.env.REACT_APP_BASE_URL}/jce/email-templates/types`;

    useEffect(() => {
        fetch(url)
            .then((res) => res.json()
                .then((data) => {
                    if (!data.data)
                        message.error(FETCHING_DATA_FAILED)
                    setItems(data.data);
                })
                .finally(() => setIsLoading(false)));
    }, [url])

    const addType = () => {
        if (newType.length > 3) {
            setItems([...items, newType]);
            setNewType('');
        }
        else
            message.error(FIELD_MIN_LENGTH("Type", 4))
    };

    const onFinish = async () => {
        const values = await form.validateFields();
        const { templateType, subject, body } = values;
        if (!templateType || !subject || !body)
            return;
        setAddLoading(false);
        const newTemplateForm = {
            templateType: templateType, subject: subject, body: body
        };

        try {
            // API Request AWS Form
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/email-templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTemplateForm),
            });
            const data: any = await response.json();
            if (data.statusCode === 200)
                message.success(EMAIL_TEMPLATE_SUCCESS);
            else
                throw data.error;
            form.resetFields();
            props.stateFunc(false);
        } catch (error: any) {
            message.error(error);
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <Modal
            title={<Divider orientation="left">Add a new email template</Divider>}
            open={props.state}
            onCancel={() => props.stateFunc(false)}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onSubmitCapture={onFinish}
            >
                {/* Type */}
                <Form.Item label='Type' name='templateType' rules={[{
                    required: true,
                    message: MISSING_FIELD("Type")
                }]}>
                    <Select
                        loading={isLoading}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider
                                    style={{
                                        margin: '8px 0',
                                    }}
                                />
                                <Space
                                    style={{
                                        padding: '0 8px 4px',
                                    }}
                                >
                                    <Input
                                        placeholder="Enter new template type"
                                        ref={inputRef}
                                        value={newType}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setNewType(event.target.value) }}
                                    />
                                    <Button type="text" icon={<PlusOutlined />} onClick={addType}>
                                        Add Type
                                    </Button>
                                </Space>
                            </>
                        )}
                        options={items?.map((item) => ({
                            label: item,
                            value: item,
                        }))}
                    />
                </Form.Item>

                {/* Subject */}
                <Form.Item label='Subject' name='subject' rules={[{
                    required: true,
                    min: 4,
                    message: FIELD_MIN_LENGTH("Subject", 4)
                }]}>
                    <Input />
                </Form.Item>

                {/* Body */}
                <Form.Item label='Body' name='body' extra={'Use double curly braces `{{}}` for pass in data'} rules={[{
                    required: true,
                    min: 10,
                    message: FIELD_MIN_LENGTH("Body", 10)
                }]}>
                    <Input.TextArea size="middle" rows={9} showCount />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={addLoading}>Add</Button>
                </Form.Item>
            </Form>
        </Modal >
    )
};

export default EditProfileModal;
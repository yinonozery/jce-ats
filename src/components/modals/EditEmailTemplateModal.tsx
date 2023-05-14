import { Divider, Modal, Input, Form, Select, Space, Button, message } from "antd";
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { FIELD_MIN_LENGTH, MISSING_FIELD, FETCHING_DATA_FAILED } from "../../utils/messages";
import { PlusOutlined } from '@ant-design/icons';

type emailTemplateType = {
    TemplateId: string,
    TemplateType: string,
    Subject: string,
    Body: string,
    UpdatedAt: string,
    key: number,
};

interface modalProps {
    template: emailTemplateType;
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

const EditEmailTemplateModal: React.FC<modalProps> = (props) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saveLoading, setAddLoading] = useState(false);
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

    const onFinish = () => {

    }

    const addType = () => {
        if (newType.length > 3) {
            setItems([...items, newType]);
            setNewType('');
        }
        else
            message.error(FIELD_MIN_LENGTH("Type", 4))
    };

    return (
        <Modal
            open={props.state}
            title={<Divider orientation="left">Edit Email template</Divider>}
            footer={null}
            onCancel={() => props.stateFunc(false)}
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
                        defaultValue={props.template?.TemplateType}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    <Input
                                        placeholder="Enter new template type"
                                        ref={inputRef}
                                        value={newType}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setNewType(event.target.value) }}
                                    />
                                    <Button type="text" icon={<PlusOutlined />} onClick={addType}>Add Type</Button>
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
                    <Input defaultValue={props.template?.Subject} />
                </Form.Item>

                {/* Body */}
                <Form.Item label='Body' name='body' extra={'Use double curly braces `{{}}` for pass in data'} rules={[{
                    required: true,
                    min: 10,
                    message: FIELD_MIN_LENGTH("Body", 10)
                }]}>
                    <Input.TextArea size="middle" rows={9} defaultValue={props.template?.Body} showCount />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={saveLoading}>Save</Button>
                </Form.Item>
            </Form>
        </Modal>
    )

}

export default EditEmailTemplateModal;
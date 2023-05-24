import { Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Candidate from './types/Candidate';
import { FETCHING_DATA_FAILED } from '../utils/messages';
import emailTemplate from './types/EmailTemplates';
import AppConfig from '../stores/appStore';

interface sendEmailProps {
    candidate: Candidate | undefined,
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

interface SelectOption {
    label: string;
    value: string;
}

interface SelectGroup {
    label: string;
    options: SelectOption[];
}

const SendEmail: React.FC<sendEmailProps> = (props) => {
    const url_templates = `${process.env.REACT_APP_BASE_URL}/jce/email-templates`;
    const [templates, setTemplates] = useState<emailTemplate[]>();
    const [selectedTemplate, setSelectedTemplate] = useState<emailTemplate>();
    const [form] = Form.useForm();

    // AppConfig.loadingHandler(true);
    useEffect(() => {
        fetch(url_templates)
            .then((res) => res.json()
                .then((data) => {
                    if (!data.data)
                        message.error(FETCHING_DATA_FAILED)
                    setTemplates(data.data);
                }).finally(() => AppConfig.loadingHandler(false)));
    }, [url_templates])

    const onCancelModal = () => {
        props.stateFunc(false);
        setSelectedTemplate(undefined);
        form.setFieldsValue({ 'option': undefined })
    }

    useEffect(() => {
        const snippets = {
            '{{first_name}}': props.candidate?.first_name,
            '{{last_name}}': props.candidate?.last_name,
            '{{email}}': props.candidate?.email,
        }

        let subject = selectedTemplate?.Subject, body = selectedTemplate?.Body;

        Object.entries(snippets).forEach(([key, value]) => {
            subject = subject?.replaceAll(key, value || '') || '';
            body = body?.replaceAll(key, value || '') || '';
        });

        form.setFieldsValue({
            'subject': subject,
            'body': body
        });
    }, [selectedTemplate, form, props.candidate])

    const sendEmail = async () => {
        const { subject, body } = await form.getFieldsValue(['subject', 'body'])
        const values = {
            email: props.candidate?.email,
            subject,
            body,
            copies: []
        }
        fetch(`${process.env.REACT_APP_BASE_URL}/jce/email-sender`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }).then((res) => res.json()).then((response) => {
            if (response.statusCode === 200)
                message.success("Email sent!")
            else
                message.error("Error occured: " + response.error)
            onCancelModal();
        }).catch((err) => {
            message.error("Error occured: " + err)
            return;
        })
    }



    const groupEmailTemplatesByType = (emailTemplates: emailTemplate[]): SelectGroup[] => {
        return emailTemplates.reduce((groups: SelectGroup[], template) => {

            let group: SelectGroup | undefined = groups.find((group) => group.label === template.TemplateType);
            if (!group) {
                group = {
                    label: template?.TemplateType,
                    options: []
                };
                groups.push(group);
            }
            const groupOption: SelectOption = {
                value: template.TemplateId,
                label: template.Subject
            };
            group.options.push(groupOption);

            return groups;
        }, []);
    };


    return (
        <>
            <Modal
                open={props.state}
                onCancel={onCancelModal}
                footer={null}
            >
                <Form
                    form={form}
                    layout='vertical'
                    style={{ padding: '20px' }}
                    onFinish={sendEmail}
                >
                    <Form.Item label='Name'>
                        <Input placeholder={props.candidate?.first_name + ' ' + props.candidate?.last_name} disabled />
                    </Form.Item>
                    <Form.Item label='Email'>
                        <Input placeholder={props.candidate?.email} disabled />
                    </Form.Item>
                    <Form.Item label='Email Template' name='option'>
                        <Select
                            options={groupEmailTemplatesByType(templates || [])}
                            onSelect={(e: string) => setSelectedTemplate(templates?.find((template) => template.TemplateId === e))}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item label='Subject' name='subject'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Body' name='body'>
                        <Input.TextArea />
                    </Form.Item>
                    <Button type='primary' htmlType='submit' block>Send Email</Button>
                </Form>
            </Modal>
        </>
    )
}

export default SendEmail;
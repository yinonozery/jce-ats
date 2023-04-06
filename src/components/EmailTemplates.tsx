import { Divider, message, Table, Dropdown, Button } from "antd";
import React, { useState, useEffect } from "react";
import { FETCHING_DATA_FAILED } from "../utils/messages";
import { EllipsisOutlined } from '@ant-design/icons';
import { AlignType } from "rc-table/lib/interface";
import type { MenuProps } from 'antd';
import NewEmailTemplate from "./Modals/NewEmailTemplateModal";

type emailTemplateType = {
    TemplateId: string,
    TemplateType: string,
    Subject: string,
    Body: string,
    UpdatedAt: string,
    key: number,
};

const EmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<emailTemplateType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [actionID, setActionID] = useState<number>(0);
    const [newTemplateModal, setNewTemplateModal] = useState<boolean>(false);
    const url = `${process.env.REACT_APP_BASE_URL}/jce/email-templates`;

    useEffect(() => {
        fetch(url)
            .then((res) => res.json()
                .then((data) => {
                    if (!data.data)
                        message.error(FETCHING_DATA_FAILED)
                    setTemplates(data.data);
                }).finally(() => setIsLoading(false)));
    }, [url])

    const items: MenuProps['items'] = [
        {
            label: <a href="##" onClick={() => alert(actionID)}>Edit</a>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: 'Delete',
            key: '3',
            danger: true,
        },
    ];

    const dropdown = (id: number) => {
        setActionID(id);
        return (
            <Dropdown menu={{ items }} trigger={['click']}>
                <EllipsisOutlined />
            </Dropdown>
        )
    }

    const columns = [
        {
            title: 'Type',
            key: 'TemplateType',
            dataIndex: 'TemplateType',
        },
        {
            title: 'Subject',
            key: 'Subject',
            dataIndex: 'Subject',
        },
        {
            title: 'Body',
            key: 'Body',
            dataIndex: 'Body',
        },
        {
            title: 'Modified At',
            key: 'Body',
            dataIndex: 'UpdatedAt',
            render: (record: any) => <>{new Date(Number(record)).toLocaleString()}</>,
        },
        {
            title: 'Actions',
            key: 'Actions',
            dataIndex: 'TemplateId',
            align: 'center' as AlignType,
            render: (record: any) => dropdown(record),
        }
    ];

    return (
        <>
            <Divider orientation="left">Email Template Management</Divider>
            <Button type="primary" style={{ marginBlockEnd: '15px' }} onClick={() => setNewTemplateModal(true)}>New</Button>
            <NewEmailTemplate state={newTemplateModal} stateFunc={setNewTemplateModal} />
            <Table
                dataSource={templates}
                columns={columns}
                size="middle"
                loading={isLoading}
                bordered
            />
        </>
    )
}

export default EmailTemplates;
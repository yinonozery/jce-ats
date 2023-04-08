import { Divider, message, Table, Dropdown, Button, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { DELETE_TEMPLATE_EMAIL, DELETE_TEMPLATE_EMAIL_SUCCESS, FETCHING_DATA_FAILED } from "../utils/messages";
import { EllipsisOutlined } from '@ant-design/icons';
import { AlignType } from "rc-table/lib/interface";
import type { MenuProps } from 'antd';
import EmailTemplateModal from "./Modals/EmailTemplateModal";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [editTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"Add" | "Edit">("Add");
    const [selectedTemplate, setSelectedTemplate] = useState<emailTemplateType | undefined>(undefined);

    const [actionID, setActionID] = useState<{
        TemplateId: string,
        TemplateType: string
    }>();

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

    const deleteTemplate = () => {
        fetch(`${url}?id=${actionID?.TemplateId}&type=${actionID?.TemplateType}`, {
            method: 'DELETE',
        })
            .then(response => response.json().then((data) => {
                if (data.statusCode === 200) {
                    message.success(DELETE_TEMPLATE_EMAIL_SUCCESS);
                    setTemplates(templates.filter((template) => template.TemplateId !== actionID?.TemplateId));
                } else {
                    message.error(data?.error);
                }
                setDeleteModal(false);
            }))
    }


    const items: MenuProps['items'] = [
        {
            label: <a href="##" onClick={() => {
                setSelectedTemplate(templates.find((template) => template.TemplateId === actionID?.TemplateId))
                setModalMode("Edit");
                setEditTemplateModal(true);
            }}>Edit</a>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <a href="#delete" onClick={() => setDeleteModal(true)}>Delete</a >,
            key: '3',
            danger: true,
        },
    ];

    const dropdown = (TemplateId: string, TemplateType: string) => {
        return (
            <Dropdown menu={{ items }} trigger={['click']} onOpenChange={() => setActionID({ TemplateId, TemplateType })}>
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
            align: 'center' as AlignType,
            render: (text: string, row: emailTemplateType) => dropdown(row.TemplateId, row.TemplateType),
        }
    ];

    return (
        <>
            <Divider orientation="left">Email Template Management</Divider>
            <Button type="primary" style={{ marginBlockEnd: '15px' }} onClick={() => {
                setEditTemplateModal(true);
                setModalMode("Add");
                setSelectedTemplate(undefined);
            }}>New</Button>
            <Table
                dataSource={templates}
                columns={columns}
                size="middle"
                loading={isLoading}
                bordered
            />
            <Modal
                onOk={() => deleteTemplate()}
                onCancel={() => setDeleteModal(false)}
                open={deleteModal}
                title={DELETE_TEMPLATE_EMAIL}
            />
            {/* <NewEmailTemplate state={newTemplateModal} stateFunc={setNewTemplateModal} /> */}
            {/* <EditEmailTemplateModal state={editTemplateModal} stateFunc={setEditTemplateModal} template={selectedTemplate} /> */}
            <EmailTemplateModal state={editTemplateModal} stateFunc={setEditTemplateModal} template={selectedTemplate} mode={modalMode} />
        </>
    )
}

export default EmailTemplates;
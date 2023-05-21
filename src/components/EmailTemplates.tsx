import { Divider, message, Table, Dropdown, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { DELETE_SURE, DELETE_SUCCESS, FETCHING_DATA_FAILED } from '../utils/messages';
import { EllipsisOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import type { MenuProps } from 'antd';
import EmailTemplateModal from './modals/EmailTemplateModal';
import EmailTemplate from './types/EmailTemplates';


const EmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [openTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'Add' | 'Edit'>('Add');
    const [actionID, setActionID] = useState<{ TemplateId: string, TemplateType: string }>();

    const url_templates = `${process.env.REACT_APP_BASE_URL}/jce/email-templates`;

    useEffect(() => {
        if (!openTemplateModal)
            fetch(url_templates)
                .then((res) => res.json()
                    .then((data) => {
                        if (!data.data)
                            message.error(FETCHING_DATA_FAILED)
                        setTemplates(data.data);
                    }).finally(() => setIsLoading(false)));
    }, [openTemplateModal, url_templates])

    const deleteTemplate = () => {
        fetch(`${url_templates}?id=${actionID?.TemplateId}`, {
            method: 'DELETE',
        })
            .then(response => response.json().then((data) => {
                if (data.statusCode === 200) {
                    message.success(DELETE_SUCCESS("Email template"));
                    setTemplates(templates.filter((template) => template.TemplateId !== actionID?.TemplateId));
                } else {
                    message.error(data?.error);
                }
                setDeleteModal(false);
            }))
    }


    const items: MenuProps['items'] = [
        {
            label: <span onClick={() => {
                setSelectedTemplate(templates.find((template) => template.TemplateId === actionID?.TemplateId))
                setModalMode('Edit');
                setEditTemplateModal(true);
            }}>Edit</span>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => setDeleteModal(true)}>Delete</span>,
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
            defaultSortOrder: 'descend',
            sorter: (a: any, b: any) => Number(a.UpdatedAt) - Number(b.UpdatedAt),
            render: (record: any) => <>{new Date(Number(record)).toLocaleString('he-IL')}</>,
        },
        {
            title: 'Actions',
            key: 'Actions',
            align: 'center' as AlignType,
            render: (text: string, row: EmailTemplate) => dropdown(row.TemplateId, row.TemplateType),
        },
    ];

    return (
        <>
            <Divider orientation='left'>Email Template Management</Divider>
            <Button type='primary' style={{ marginBlockEnd: '15px' }} onClick={() => {
                setEditTemplateModal(true);
                setModalMode('Add');
                setSelectedTemplate(undefined);
            }}>New</Button>
            <Table
                dataSource={templates}
                //@ts-ignore
                columns={columns}
                size='middle'
                loading={isLoading}
                bordered
            />
            <Modal
                onOk={() => deleteTemplate()}
                onCancel={() => setDeleteModal(false)}
                open={deleteModal}
                title={DELETE_SURE("email template")}
            />
            <EmailTemplateModal state={openTemplateModal} stateFunc={setEditTemplateModal} template={selectedTemplate} mode={modalMode} />
        </>
    )
}

export default EmailTemplates;
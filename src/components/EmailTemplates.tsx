import { Divider, message, Table, Dropdown, Button, Modal, TableProps } from 'antd';
import React, { useState, useEffect } from 'react';
import { DELETE_SURE, DELETE_SUCCESS } from '../utils/messages';
import { EllipsisOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import type { MenuProps } from 'antd';
import EmailTemplateModal from './modals/EmailTemplateModal';
import EmailTemplate from './types/EmailTemplate';
import DataStore from '../stores/dataStore';


const EmailTemplates: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [openTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'Add' | 'Edit'>('Add');
    const [actionID, setActionID] = useState<{ TemplateId: string, TemplateType: string }>();

    useEffect(() => {
        DataStore.fetchTemplatesData(false)
    }, [])

    const deleteTemplate = async () => {
        const url_templates = `${process.env.REACT_APP_BASE_URL}/jce/email-templates`;
        const response = await fetch(`${url_templates}?id=${actionID?.TemplateId}`, {
            method: 'DELETE',
        })
        const data = await response.json();
        if (data.statusCode === 200) {
            message.success(DELETE_SUCCESS("Email template"));
            DataStore.fetchKeywordsData(true);
        } else {
            message.error(data?.error);
        }
        setDeleteModal(false);
    }


    const items: MenuProps['items'] = [
        {
            label: <span onClick={() => {
                setSelectedTemplate(DataStore.templatesData?.find((template) => template.TemplateId === actionID?.TemplateId))
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

    const columns: TableProps<EmailTemplate>['columns'] = [
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
            sorter: (a: EmailTemplate, b: EmailTemplate) => Number(a.UpdatedAt) - Number(b.UpdatedAt),
            render: (record: string) => <>{new Date(Number(record)).toLocaleString('he-IL')}</>,
        },
        {
            title: 'Actions',
            key: 'Actions',
            align: 'center' as AlignType,
            render: (text: string, rowData: EmailTemplate) => dropdown(rowData.TemplateId, rowData.TemplateType),
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
                dataSource={DataStore.templatesData}
                columns={columns}
                size='middle'
                loading={DataStore.templatesData ? false : true}
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
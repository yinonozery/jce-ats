import { Divider, message, Table, Button, Modal, TableProps, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { DELETE_SURE, DELETE_SUCCESS } from '../utils/messages';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import EmailTemplateModal from './modals/EmailTemplateModal';
import EmailTemplate from './types/EmailTemplate';
import DataStore from '../stores/dataStore';
import { observer } from 'mobx-react';

const EmailTemplates: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [openTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'Add' | 'Edit'>('Add');

    useEffect(() => {
        DataStore.fetchTemplatesData(false)
    }, [])

    const deleteTemplate = async () => {
        const url_templates = `${process.env.REACT_APP_BASE_URL}/email-templates`;
        const response = await fetch(`${url_templates}?id=${selectedTemplate?.TemplateId}`, {
            method: 'DELETE',
        })
        const data = await response.json();
        if (data.statusCode === 200) {
            message.success(DELETE_SUCCESS("Email template"));
            DataStore.templatesData = DataStore.templatesData?.filter((template) => template.TemplateId !== selectedTemplate?.TemplateId)
        } else {
            message.error(data?.error);
        }
        setDeleteModal(false);
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
            render: (_: string, rowData: EmailTemplate) =>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <Tooltip title="Edit">
                        <Button type='link' size='small' onClick={() => {
                            setSelectedTemplate(DataStore.templatesData?.find((template) => template.TemplateId === rowData.TemplateId))
                            setModalMode('Edit');
                            setEditTemplateModal(true);
                        }}>
                            <EditOutlined style={{ fontSize: '1.2em', color: '#3399FF' }} />
                        </Button>
                    </Tooltip>
                    <Divider type='vertical' style={{ backgroundColor: '#dddddd', margin: 0 }} />
                    <Tooltip title="Delete">
                        <Button type='link' size='small' onClick={() => { setSelectedTemplate(DataStore.templatesData?.find((template) => template.TemplateId === rowData.TemplateId)); setDeleteModal(true) }} danger>
                            <DeleteOutlined style={{ fontSize: '1.2em' }} />
                        </Button>
                    </Tooltip>
                </div>
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
                title={
                    <>
                        <ExclamationCircleOutlined style={{ fontSize: '1.5em', color: 'red' }} />
                        <p style={{ marginBlockEnd: '20px' }}>
                            {DELETE_SURE("email template '" + selectedTemplate?.Subject + "'")}
                        </p>
                    </>
                }
                onOk={() => deleteTemplate()}
                onCancel={() => setDeleteModal(false)}
                open={deleteModal}
                okButtonProps={{ style: { backgroundColor: 'red' } }}
            />
            <EmailTemplateModal state={openTemplateModal} stateFunc={setEditTemplateModal} template={selectedTemplate} mode={modalMode} />
        </>
    )
}

export default observer(EmailTemplates);
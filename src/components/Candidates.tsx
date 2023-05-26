import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Button, Input, Space, Table, Divider, message, InputRef, Modal, Tooltip } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { DELETE_SUCCESS, DELETE_SURE } from '../utils/messages';
import Candidate from './types/Candidate';
import Discover from './Discover';
import SendEmail from './modals/SendEmailModal';
import DataStore from '../stores/dataStore';
import type { ColumnType } from 'antd/es/table';

type DataIndex = keyof Candidate;

const Candidates: React.FC = () => {
    const [deleteModal, setDeleteModal] = useState<{ mode: boolean, id: string, file: string }>({ mode: false, id: '', file: '' });
    const [sendEmailModal, setSendEmailModal] = useState<boolean>(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();

    const searchInput = useRef<InputRef>(null);
    const url_candidates = `${process.env.REACT_APP_BASE_URL}/jce/candidates`;

    useEffect(() => {
        DataStore.fetchCandidatesData(false);
    }, []);
    
    const deleteCandidate = () => {
        fetch(`${url_candidates}?id=${deleteModal.id}&file=${deleteModal.file}`, {
            method: 'DELETE',
        })
            .then(response => response.json().then((data) => {
                if (data.statusCode === 200) {
                    message.success(DELETE_SUCCESS("Candidate"));
                    DataStore.fetchCandidatesData(true);
                } else {
                    message.error(data?.error);
                }

                setDeleteModal({ mode: false, id: '', file: '' });
            }))
    }

    const contact_email = (link: string) =>
        <a key='email' href={`mailto:${link}`}><img style={{ height: '36px' }} alt='Email' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIKdmlld0JveD0iMCAwIDQ4IDQ4Ij4KPHBhdGggZmlsbD0iIzFlODhlNSIgZD0iTTM0LDQySDE0Yy00LjQxMSwwLTgtMy41ODktOC04VjE0YzAtNC40MTEsMy41ODktOCw4LThoMjBjNC40MTEsMCw4LDMuNTg5LDgsOHYyMCBDNDIsMzguNDExLDM4LjQxMSw0MiwzNCw0MnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzUuOTI2LDE3LjQ4OEwyOS40MTQsMjRsNi41MTEsNi41MTFDMzUuOTY5LDMwLjM0NywzNiwzMC4xNzgsMzYsMzBWMTggQzM2LDE3LjgyMiwzNS45NjksMTcuNjUzLDM1LjkyNiwxNy40ODh6IE0yNi42ODgsMjMuODk5bDcuODI0LTcuODI1QzM0LjM0NywxNi4wMzEsMzQuMTc4LDE2LDM0LDE2SDE0IGMtMC4xNzgsMC0wLjM0NywwLjAzMS0wLjUxMiwwLjA3NGw3LjgyNCw3LjgyNUMyMi43OTUsMjUuMzgsMjUuMjA1LDI1LjM4LDI2LjY4OCwyMy44OTl6IE0yNCwyNy4wMDkgYy0xLjQ0LDAtMi44NzMtMC41NDItMy45OS0xLjYwNWwtNi41MjIsNi41MjJDMTMuNjUzLDMxLjk2OSwxMy44MjIsMzIsMTQsMzJoMjBjMC4xNzgsMCwwLjM0Ny0wLjAzMSwwLjUxMi0wLjA3NGwtNi41MjItNi41MjIgQzI2Ljg3MywyNi40NjcsMjUuNDQsMjcuMDA5LDI0LDI3LjAwOXogTTEyLjA3NCwxNy40ODhDMTIuMDMxLDE3LjY1MywxMiwxNy44MjIsMTIsMTh2MTJjMCwwLjE3OCwwLjAzMSwwLjM0NywwLjA3NCwwLjUxMiBMMTguNTg2LDI0TDEyLjA3NCwxNy40ODh6Ij48L3BhdGg+Cjwvc3ZnPg==' /></a>;
    const contact_github = (link: string) =>
        <a key='github' href={`https://${link}`} target='_blank' rel='noreferrer'><img style={{ height: '30px' }} alt='Github' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==' /></a>;
    const contact_linkedin = (link: string) =>
        <a key='linkedin' href={`https://${link}`} target='_blank' rel='noreferrer'><img style={{ height: '36px' }} alt='LinkedIn' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIKdmlld0JveD0iMCAwIDQ4IDQ4Ij4KPHBhdGggZmlsbD0iIzAyODhEMSIgZD0iTTQyLDM3YzAsMi43NjItMi4yMzgsNS01LDVIMTFjLTIuNzYxLDAtNS0yLjIzOC01LTVWMTFjMC0yLjc2MiwyLjIzOS01LDUtNWgyNmMyLjc2MiwwLDUsMi4yMzgsNSw1VjM3eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMiAxOUgxN1YzNkgxMnpNMTQuNDg1IDE3aC0uMDI4QzEyLjk2NSAxNyAxMiAxNS44ODggMTIgMTQuNDk5IDEyIDEzLjA4IDEyLjk5NSAxMiAxNC41MTQgMTJjMS41MjEgMCAyLjQ1OCAxLjA4IDIuNDg2IDIuNDk5QzE3IDE1Ljg4NyAxNi4wMzUgMTcgMTQuNDg1IDE3ek0zNiAzNmgtNXYtOS4wOTljMC0yLjE5OC0xLjIyNS0zLjY5OC0zLjE5Mi0zLjY5OC0xLjUwMSAwLTIuMzEzIDEuMDEyLTIuNzA3IDEuOTlDMjQuOTU3IDI1LjU0MyAyNSAyNi41MTEgMjUgMjd2OWgtNVYxOWg1djIuNjE2QzI1LjcyMSAyMC41IDI2Ljg1IDE5IDI5LjczOCAxOWMzLjU3OCAwIDYuMjYxIDIuMjUgNi4yNjEgNy4yNzRMMzYgMzYgMzYgMzZ6Ij48L3BhdGg+Cjwvc3ZnPg==' /></a>;
    const contact_facebook = (link: string) =>
        <a key='facebook' href={`https://${link}`} target='_blank' rel='noreferrer'><img style={{ height: '36px' }} alt='Facebook' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl84N183MjA4KSIvPg0KPHBhdGggZD0iTTIxLjIxMzcgMjAuMjgxNkwyMS44MzU2IDE2LjMzMDFIMTcuOTQ1MlYxMy43NjdDMTcuOTQ1MiAxMi42ODU3IDE4LjQ4NzcgMTEuNjMxMSAyMC4yMzAyIDExLjYzMTFIMjJWOC4yNjY5OUMyMiA4LjI2Njk5IDIwLjM5NDUgOCAxOC44NjAzIDhDMTUuNjU0OCA4IDEzLjU2MTcgOS44OTI5NCAxMy41NjE3IDEzLjMxODRWMTYuMzMwMUgxMFYyMC4yODE2SDEzLjU2MTdWMjkuODM0NUMxNC4yNzY3IDI5Ljk0NCAxNS4wMDgyIDMwIDE1Ljc1MzQgMzBDMTYuNDk4NiAzMCAxNy4yMzAyIDI5Ljk0NCAxNy45NDUyIDI5LjgzNDVWMjAuMjgxNkgyMS4yMTM3WiIgZmlsbD0id2hpdGUiLz4NCjxkZWZzPg0KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzg3XzcyMDgiIHgxPSIxNiIgeTE9IjIiIHgyPSIxNiIgeTI9IjI5LjkxNyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPg0KPHN0b3Agc3RvcC1jb2xvcj0iIzE4QUNGRSIvPg0KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDE2M0UwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPC9kZWZzPg0KPC9zdmc+' /></a>;

    const getColumnSearchProps = (dataIndex: DataIndex, dataIndex2: DataIndex): ColumnType<Candidate> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={dataIndex2 ? `Search Name` : `Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type='primary' onClick={() => confirm()} icon={<SearchOutlined />} size='small' style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && clearFilters()} size='small' style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button type='link' size='small' onClick={() => close()}><CloseCircleOutlined /></Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase())
            ||
            record[dataIndex2].toString().toLowerCase().includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible)
                setTimeout(() => searchInput.current?.select(), 100);
        }
    });

    const CircleButton = (color: string, tooltip: string) =>
        <div style={{ textAlign: 'center' }}>
            <Tooltip title={tooltip}>
                <Button type="text"
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: color,
                    }}
                    icon={<CheckCircleOutlined style={{ position: 'relative', color: '#fff', textAlign: 'center', verticalAlign: 'center', bottom: '3px' }} />}
                />
            </Tooltip>
        </div>


    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (record: { first_name: string; last_name: string; }) => `${record.first_name} ${record.last_name}`,
            ...getColumnSearchProps('last_name', 'first_name'),
            sorter: (a: Candidate, b: Candidate) => a.first_name.localeCompare(b.first_name),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            filters: [
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' },
            ],
            onFilter: (value: any, record: Candidate) => record.gender === value,
        },
        {
            title: 'Years Exp',
            dataIndex: 'work_experience',
            key: 'work_experience',
            sorter: (a: any, b: any) => a.work_experience - b.work_experience,
        },
        {
            title: 'Resume file',
            dataIndex: 'resume_file_name',
            key: 'resume_file_name',
            render: (record: any) => <a style={{ display: 'flex', justifyContent: 'center' }} href={`${process.env.REACT_APP_BASE_URL}/jce/resume?file_name=${record}`} target='_blank' rel='noreferrer'><Button style={{ borderRadius: '50%', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px', fontSize: '1.5vh', height: '3.5vh', width: '3.5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} type='default' shape='circle' icon={<CloudDownloadOutlined />} /></a>
        },
        {
            title: 'Contact',
            dataIndex: 'keywords',
            key: 'contact',
            render: (record: any) =>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {Object.keys(record).map((word: string) => {
                        if (word.includes('linkedin.com/in')) return contact_linkedin(word);
                        else if (word.includes('github.com')) return contact_github(word);
                        else if (word.includes('github.com')) return contact_facebook(word);
                        else if (word.includes('@') && word.includes('.')) return contact_email(word);
                        return null;
                    })}
                </div>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (record: string) =>
                record === "Available" ? CircleButton('#2196f3', 'Available')
                    : record === "Rejected" ? CircleButton('#ff4d4f', 'Rejected')
                        : record === "In progress" ? CircleButton('#ffa726', 'In progress')
                            : CircleButton('#4caf50', 'Accepted'),
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'id',
            render: (render: string, rowData: Candidate) => <>
                <Button type='link' size='small' onClick={() => setDeleteModal({ mode: true, id: rowData.id, file: rowData.resume_file_name })}>Delete</Button>
                <Button type='link' size='small' onClick={() => { setSendEmailModal(true); setSelectedCandidate(rowData) }}>Invite</Button>
            </>
        },
    ];

    return (
        <>
            <SendEmail state={sendEmailModal} stateFunc={setSendEmailModal} candidate={selectedCandidate} />
            <Discover />
            {/* Candidates */}
            <Divider orientation='left'>Candidates List</Divider>
            <Table
                dataSource={DataStore.candidatesData || []}
                loading={DataStore.candidatesData ? false : true}
                columns={columns}
                size='small'
                bordered
            />
            <Modal
                onOk={() => deleteCandidate()}
                onCancel={() => setDeleteModal({ mode: false, id: '', file: '' })}
                open={deleteModal.mode}
                title={DELETE_SURE("candidate")}
            />
        </>
    )
};

export default observer(Candidates);
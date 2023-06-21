import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space, Table, Divider, InputRef, Tooltip } from 'antd';
import Candidate from './types/Candidate';
import Discover from './Discover';
import SendEmail from './modals/SendEmailModal';
import dataStore from '../stores/dataStore';
import KeywordsHeatmap from './modals/KeywordsHeatmap';
import EditCandidate from './modals/EditCandidateModal';
import DeleteCandidateModal from './modals/DeleteCandidateModal';
import CandidateStatus from '../utils/CandidateStatus';
import socialMedia from '../utils/SocialMediaIcons';
import { DoubleRightOutlined, SearchOutlined, CloseCircleOutlined, VideoCameraAddOutlined, CloudDownloadOutlined, DeleteOutlined, SendOutlined, EditOutlined, FullscreenOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

type DataIndex = keyof Candidate;

const Candidates: React.FC = () => {
    const [sendEmailModal, setSendEmailModal] = useState<boolean>(false);
    const [candidateCardModal, setCandidateCardModal] = useState<boolean>(false);
    const [editCandidateModal, setEditCandidateModal] = useState<boolean>(false);
    const [deleteCandidateModal, setDeleteCandidateModal] = useState<boolean>(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();

    useEffect(() => {
        dataStore.fetchCandidatesData(false);
    }, []);

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


    const columns = [
        {
            title: 'Name',
            key: 'name',
            align: 'center',
            ...getColumnSearchProps('last_name', 'first_name'),
            sorter: (a: Candidate, b: Candidate) => a.first_name.localeCompare(b.first_name),
            render: (record: { first_name: string; last_name: string; }) => <>{record.first_name} {record.last_name}</>,
        },
        {
            title: 'Degree',
            dataIndex: 'degree',
            key: 'degree',
            align: 'center',
            filters: [
                { text: 'Associate', value: 'Associate' },
                { text: 'Bachelor', value: 'Bachelor' },
                { text: 'Master', value: 'Master' },
                { text: 'Doctor', value: 'Doctor' },
            ],
            onFilter: (value: any, record: Candidate) => record.degree === value,
        },
        {
            title: 'Years of Exp',
            dataIndex: 'work_experience',
            key: 'work_experience',
            align: 'center',
            sorter: (a: any, b: any) => a.work_experience - b.work_experience,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            align: 'center',
            filters: [
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' },
            ],
            onFilter: (value: any, record: Candidate) => record.gender === value,
        },
        {
            title: 'Resume file',
            dataIndex: 'resume_file_name',
            key: 'resume_file_name',
            align: 'center',
            render: (record: any) =>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        onClick={() => {
                            fetch(`${process.env.REACT_APP_BASE_URL}/resume?file_name=${record}`, {
                                method: 'GET',
                                headers: {
                                    'X-Api-Key': process.env.REACT_APP_API_KEY || '',
                                },
                            })
                                .then((response: any) => response.text())
                                .then((html: any) => {
                                    const blob = new Blob([html], { type: 'text/html' });
                                    const url = URL.createObjectURL(blob);
                                    const width = 1200; // Set the desired width for the new window
                                    const height = 1000; // Set the desired height for the new window
                                    const left = window.innerWidth / 2 - width / 2;
                                    const top = window.innerHeight / 2 - height / 2;
                                    const options = `width=${width},height=${height},left=${left},top=${top}`;
                                    window.open(url, '_blank', options);
                                    URL.revokeObjectURL(url);
                                });
                        }}
                        style={{
                            borderRadius: '50%',
                            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px',
                            fontSize: '1.5vh',
                            height: '30px',
                            width: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        type='default'
                        shape='circle'
                        icon={<CloudDownloadOutlined />}
                    ></Button>
                </span>


        },
        {
            title: 'Social Media',
            dataIndex: 'keywords',
            key: 'social',
            render: (record: any, rowData: Candidate) => {
                if (rowData.resume_file_name.endsWith('.pdf')) {
                    return (
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', alignContent: 'center' }}>
                            {rowData.links.map((word: string) => {
                                if (word.includes('linkedin.com/in')) return socialMedia.Contact_Linkedin(word);
                                // else if (word.includes('github.com')) return socialMedia.Contact_Github(word);
                                else if (word.includes('facebook.com')) return socialMedia.Contact_Facebook(word);
                                // else if (word.includes('@') && word.includes('.')) return socialMedia.Contact_Email(word);
                                else if (word.includes('stackoverflow.com/users')) return socialMedia.Contact_StackOverflow(word);
                                return null;
                            })}
                        </div>)
                }
                else {
                    return (
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', alignContent: 'center' }}>
                            {Object.keys(record).map((word: string) => {
                                if (word.includes('linkedin.com/in')) return socialMedia.Contact_Linkedin(word);
                                // else if (word.includes('github.com')) return socialMedia.Contact_Github(word);
                                else if (word.includes('facebook.com')) return socialMedia.Contact_Facebook(word);
                                // else if (word.includes('@') && word.includes('.')) return socialMedia.Contact_Email(word);
                                else if (word.includes('stackoverflow.com/users')) return socialMedia.Contact_StackOverflow(word);
                                return null;
                            })}
                        </div>)
                }
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (record: Candidate['status'], rowData: Candidate) => <div style={{ display: 'flex', justifyContent: 'center' }}><CandidateStatus status={record} candidateID={rowData.id} resumeFileName={rowData.resume_file_name} /></div>
        },
        {
            title: () => (
                <>Keywords<br />Heatmap</>
            ),
            key: 'KeywordsModal',
            align: 'center',
            render: (_: any, rowData: Candidate) => <Button type='link' onClick={() => { setCandidateCardModal(true); setSelectedCandidate(rowData) }} icon={<FullscreenOutlined />} />,
        },
        {
            title: 'Actions',
            align: 'center',
            render: (_: string, rowData: Candidate) =>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Tooltip title="Delete"><Button type='link' size='small' onClick={() => { setDeleteCandidateModal(true); setSelectedCandidate(rowData) }} danger><DeleteOutlined style={{ fontSize: '1.2em' }} /></Button></Tooltip>
                    <Divider type='vertical' style={{ backgroundColor: '#dddddd', margin: 0 }} />
                    <Tooltip title="Edit"><Button type='link' size='small' onClick={() => { setEditCandidateModal(true); setSelectedCandidate(rowData) }}><EditOutlined style={{ fontSize: '1.2em', color: '#3399FF' }} /></Button></Tooltip>
                    <Divider type='vertical' style={{ backgroundColor: '#dddddd', margin: 0 }} />
                    <Tooltip title="Send Email"><Button type='link' size='small' onClick={() => { setSendEmailModal(true); setSelectedCandidate(rowData) }}><SendOutlined style={{ fontSize: '1.2em', color: '#00C851 ' }} /></Button></Tooltip>
                    <Divider type='vertical' style={{ backgroundColor: '#dddddd', margin: 0 }} />
                    <Tooltip title="Schedule Video Interview"><Button type='link' size='small' onClick={() => { navigate('/meeting', { state: { candidate: JSON.stringify(rowData) } }); }}><VideoCameraAddOutlined style={{ fontSize: '1.2em', color: '#8E44AD ' }} /></Button></Tooltip>
                </div>
        },
    ];

    return (
        <>
            <SendEmail state={sendEmailModal} stateFunc={setSendEmailModal} candidate={selectedCandidate} />
            <KeywordsHeatmap state={candidateCardModal} stateFunc={setCandidateCardModal} candidate={selectedCandidate} />
            <EditCandidate state={editCandidateModal} stateFunc={setEditCandidateModal} candidate={selectedCandidate} />
            <DeleteCandidateModal state={deleteCandidateModal} stateFunc={setDeleteCandidateModal} candidate={selectedCandidate} />
            <Discover />

            {/* Candidates Table */}
            <Divider orientation='left'><DoubleRightOutlined />&nbsp;&nbsp;Candidates List ({dataStore.candidatesData?.length})</Divider>
            <Table
                showSorterTooltip={false}
                tableLayout='auto'
                dataSource={dataStore.candidatesData}
                loading={dataStore.candidatesData ? false : true}
                // @ts-ignore
                columns={columns}
                size='large'
                bordered
            />
        </>
    )
};

export default observer(Candidates);
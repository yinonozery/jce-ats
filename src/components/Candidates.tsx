import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Button, Input, Space, Table, Divider, message, InputRef, Modal, Tooltip } from 'antd';
import { DoubleRightOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, CloudDownloadOutlined, DeleteOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';
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

    const Contact_Email = (link: string) =>
        <a key='email' href={`mailto:${link}`}><img width="25" alt='Email' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgo8ZGVmcz4KPC9kZWZzPgo8ZyBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDA7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IG5vbmU7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNDA2NTkzNDA2NTkzNDAxNiAxLjQwNjU5MzQwNjU5MzQwMTYpIHNjYWxlKDIuODEgMi44MSkiID4KCTxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjQ1IiBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IHJnYigzNSw5MSwyMTYpOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IiB0cmFuc2Zvcm09IiAgbWF0cml4KDEgMCAwIDEgMCAwKSAiLz4KCTxwYXRoIGQ9Ik0gNjQuNTY3IDI2LjQ5NSBIIDI1LjQzMyBjIC0zLjE0MiAwIC01LjY4OSAyLjU0NyAtNS42ODkgNS42ODkgdiAyNS42MzEgYyAwIDMuMTQyIDIuNTQ3IDUuNjg5IDUuNjg5IDUuNjg5IGggMzkuMTM1IGMgMy4xNDIgMCA1LjY4OSAtMi41NDcgNS42ODkgLTUuNjg5IFYgMzIuMTg0IEMgNzAuMjU2IDI5LjA0MyA2Ny43MDkgMjYuNDk1IDY0LjU2NyAyNi40OTUgeiBNIDYzLjM0MyA1Ny40NyBjIC0wLjI5NSAwLjMwNiAtMC42ODggMC40NiAtMS4wODEgMC40NiBjIC0wLjM3NCAwIC0wLjc0OSAtMC4xNCAtMS4wNCAtMC40MTkgbCAtOS40MTkgLTkuMDY1IGwgLTEuMzU3IDEuNDg5IGMgLTEuMzk0IDEuNTI4IC0zLjM3OCAyLjQwNCAtNS40NDYgMi40MDQgYyAtMi4wNjggMCAtNC4wNTMgLTAuODc2IC01LjQ0NiAtMi40MDQgbCAtMS4zMzcgLTEuNDY3IGwgLTkuMDIyIDkuMDIzIGMgLTAuMjkyIDAuMjkzIC0wLjY3NyAwLjQzOSAtMS4wNjEgMC40MzkgcyAtMC43NjggLTAuMTQ2IC0xLjA2MSAtMC40MzkgYyAtMC41ODYgLTAuNTg2IC0wLjU4NiAtMS41MzUgMCAtMi4xMjEgbCA5LjEyIC05LjEyMSBMIDI2LjYzIDM1Ljc1NCBjIC0wLjU1OCAtMC42MTIgLTAuNTE0IC0xLjU2MSAwLjA5OCAtMi4xMTkgYyAwLjYxMyAtMC41NTggMS41NjIgLTAuNTE0IDIuMTE5IDAuMDk4IGwgMTIuOTI0IDE0LjE4IGMgMC44MzggMC45MiAxLjk4NSAxLjQyNiAzLjIyOSAxLjQyNiBzIDIuMzkyIC0wLjUwNiAzLjIyOSAtMS40MjYgbCAyLjQyMiAtMi42NTcgbCAxMC41MDIgLTExLjUyMiBjIDAuNTU5IC0wLjYxMiAxLjUwNyAtMC42NTUgMi4xMTkgLTAuMDk4IGMgMC42MTIgMC41NTggMC42NTYgMS41MDYgMC4wOTggMi4xMTkgbCAtOS41NDYgMTAuNDc0IGwgOS40NzcgOS4xMjEgQyA2My44OTggNTUuOTI0IDYzLjkxNyA1Ni44NzMgNjMuMzQzIDU3LjQ3IHoiIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiAxMDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgbWF0cml4KDEgMCAwIDEgMCAwKSAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8L3N2Zz4=" /></a>;
    const Contact_Github = (link: string) =>
        <a key='github' href={`https://${link}`} target='_blank' rel='noreferrer'><img width="25" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIGZpbGw9IiMzMzMzMzMiIHI9IjI1NiIvPjxnPjxwYXRoIGQ9Ik0yNTYsOTMuOWMtODkuNSwwLTE2Mi4xLDcyLjYtMTYyLjEsMTYyLjFjMCw3MC41LDQ1LDEzMC40LDEwNy44LDE1Mi44YzAuMywwLjEsMS40LDAuNSwxLjcsMC42ICAgIGMwLjksMC4zLDEuOSwwLjUsMi45LDAuNWM1LjMsMCw5LjUtNC4zLDkuNS05LjVjMC0wLjMsMC0wLjUsMC0wLjhsMCwwYzAtOC42LDAtMTkuNSwwLTI4LjJjLTEwLjMsMi4xLTI1LjksNC4xLTM0LjQsMCAgICBjLTExLTUuMy0xNi42LTEyLjEtMjEuOS0yNS41Yy02LjYtMTYuMy0yMS44LTIwLjgtMjIuNC0yMy42Yy0wLjYtMi45LDE2LjEtNy4yLDI0LjcsMi43YzguNiw5LjksMTcuMywyOS43LDM1LjgsMjcuOCAgICBjOS4xLTAuOSwxNS0yLjQsMTguNy0zLjVjMC43LTYuNCwyLjgtMTQuMyw4LjEtMTkuOWMtNDMuNS03LjItNzIuNS0zMC42LTcyLjUtNzYuNWMwLTIwLjksNi0zNy4xLDE2LjYtNDkuMiAgICBjLTEuOC0xMC00LjgtMzMuMiwzLjItNDEuM2MwLDAsMTEuMy03LDQzLjcsMTUuOGMxMi4xLTIuOCwyNS41LTQuMiwzOS44LTQuMmwwLDBjMC4zLDAsMC41LDAsMC44LDBjMC4zLDAsMC41LDAsMC44LDBsMCwwICAgIGMxNC40LDAuMSwyNy44LDEuNSwzOS44LDQuMmMzMi40LTIyLjgsNDMuNy0xNS44LDQzLjctMTUuOGM4LDguMiw1LDMxLjQsMy4yLDQxLjNjMTAuNiwxMi4yLDE2LjYsMjguNCwxNi42LDQ5LjIgICAgYzAsNDUuOS0yOC45LDY5LjMtNzIuNSw3Ni41YzguMyw4LjcsOC42LDIyLjgsOC42LDI4LjZjMCw1LjUsMCw0Mi4zLDAsNDIuNWMwLDUuMyw0LjMsOS41LDkuNSw5LjVjMC44LDAsMS41LTAuMSwyLjMtMC4zICAgIGMwLjIsMCwwLjgtMC4yLDEtMC4zYzYzLjUtMjIsMTA5LjEtODIuMywxMDkuMS0xNTMuM0M0MTguMSwxNjYuNCwzNDUuNSw5My45LDI1Niw5My45eiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48L2c+PC9zdmc+" alt="" /></a>
    const Contact_Linkedin = (link: string) =>
        <a key='linkedin' href={`https://${link}`} target='_blank' rel='noreferrer'><img width="25" alt='LinkedIn' src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMjRDMCAxMC43NDUyIDEwLjc0NTIgMCAyNCAwQzM3LjI1NDggMCA0OCAxMC43NDUyIDQ4IDI0QzQ4IDM3LjI1NDggMzcuMjU0OCA0OCAyNCA0OEMxMC43NDUyIDQ4IDAgMzcuMjU0OCAwIDI0WiIgZmlsbD0iIzAwNzdCNSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE3LjMxODggMTQuODIyN0MxNy4zMTg4IDE2LjM5MTggMTYuMTM3NyAxNy42NDczIDE0LjI0MTIgMTcuNjQ3M0gxNC4yMDY0QzEyLjM4MDUgMTcuNjQ3MyAxMS4yIDE2LjM5MTggMTEuMiAxNC44MjI3QzExLjIgMTMuMjIwNCAxMi40MTY0IDEyIDE0LjI3NyAxMkMxNi4xMzc3IDEyIDE3LjI4MzUgMTMuMjIwNCAxNy4zMTg4IDE0LjgyMjdaTTE2Ljk2MDUgMTkuODc3OFYzNi4yMTk2SDExLjUyMTZWMTkuODc3OEgxNi45NjA1Wk0zNi41NzUyIDM2LjIxOTZMMzYuNTc1NCAyNi44NDk3QzM2LjU3NTQgMjEuODMwMyAzMy44OTIyIDE5LjQ5NDEgMzAuMzEzMSAxOS40OTQxQzI3LjQyNTQgMTkuNDk0MSAyNi4xMzI1IDIxLjA4MDIgMjUuNDEwNyAyMi4xOTI5VjE5Ljg3ODNIMTkuOTcxMUMyMC4wNDI4IDIxLjQxMTcgMTkuOTcxMSAzNi4yMiAxOS45NzExIDM2LjIySDI1LjQxMDdWMjcuMDkzNEMyNS40MTA3IDI2LjYwNSAyNS40NDYgMjYuMTE3OCAyNS41ODk4IDI1Ljc2ODFDMjUuOTgyOSAyNC43OTI0IDI2Ljg3NzkgMjMuNzgyMiAyOC4zODA1IDIzLjc4MjJDMzAuMzQ5NCAyMy43ODIyIDMxLjEzNjUgMjUuMjgwNyAzMS4xMzY1IDI3LjQ3NjdWMzYuMjE5NkgzNi41NzUyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==' /></a>;
    const Contact_Facebook = (link: string) =>
        <a key='facebook' href={`https://${link}`} target='_blank' rel='noreferrer'><img width="25" alt='Facebook' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgo8ZGVmcz4KPC9kZWZzPgo8ZyBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDA7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IG5vbmU7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNDA2NTkzNDA2NTkzNDAxNiAxLjQwNjU5MzQwNjU5MzQwMTYpIHNjYWxlKDIuODEgMi44MSkiID4KCTxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjQ1IiBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IHJnYig2MCw5MCwxNTMpOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IiB0cmFuc2Zvcm09IiAgbWF0cml4KDEgMCAwIDEgMCAwKSAiLz4KCTxwYXRoIGQ9Ik0gMzguNjMzIDM3LjE4NCB2IDkuMTM2IGggLTEwLjY0IHYgMTIuMzg4IGggMTAuNjQgdiAzMC44MzYgQyA0MC43MTQgODkuODM4IDQyLjgzOCA5MCA0NSA5MCBjIDIuMTU5IDAgNC4yOCAtMC4xNjIgNi4zNTkgLTAuNDU2IFYgNTguNzA4IGggMTAuNjEzIGwgMS41ODkgLTEyLjM4OCBIIDUxLjM1OSB2IC03LjkwOSBjIDAgLTMuNTg3IDAuOTkxIC02LjAzMSA2LjEwNyAtNi4wMzEgbCA2LjUyNSAtMC4wMDMgdiAtMTEuMDggYyAtMS4xMjggLTAuMTUxIC01LjAwMiAtMC40ODggLTkuNTA4IC0wLjQ4OCBDIDQ1LjA3NCAyMC44MSAzOC42MzMgMjYuNTgyIDM4LjYzMyAzNy4xODQgeiIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiByZ2IoMjU1LDI1NSwyNTUpOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IiB0cmFuc2Zvcm09IiBtYXRyaXgoMSAwIDAgMSAwIDApICIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgo8L2c+Cjwvc3ZnPg==' /></a>;

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
        <Tooltip title={tooltip}>
            <Button type="text"
                style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: color,
                }}
                icon={<CheckCircleOutlined style={{ position: 'relative', color: '#fff', bottom: '3px' }} />}
            />
        </Tooltip>


    const columns = [
        {
            title: 'Name',
            key: 'name',
            align: 'center',
            render: (record: { first_name: string; last_name: string; }) => `${record.first_name} ${record.last_name}`,
            ...getColumnSearchProps('last_name', 'first_name'),
            sorter: (a: Candidate, b: Candidate) => a.first_name.localeCompare(b.first_name),
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
            title: 'Years Exp',
            dataIndex: 'work_experience',
            key: 'work_experience',
            align: 'center',
            sorter: (a: any, b: any) => a.work_experience - b.work_experience,
        },
        {
            title: 'Resume file',
            dataIndex: 'resume_file_name',
            key: 'resume_file_name',
            align: 'center',
            render: (record: any) => <a style={{ display: 'flex', justifyContent: 'center' }} href={`${process.env.REACT_APP_BASE_URL}/jce/resume?file_name=${record}`} target='_blank' rel='noreferrer'><Button style={{ borderRadius: '50%', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px', fontSize: '1.5vh', height: '3.5vh', width: '3.5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} type='default' shape='circle' icon={<CloudDownloadOutlined />} /></a>
        },
        {
            title: 'Contact',
            dataIndex: 'keywords',
            key: 'contact',
            render: (record: any) =>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', alignContent: 'center' }}>
                    {Object.keys(record).map((word: string) => {
                        if (word.includes('linkedin.com/in')) return Contact_Linkedin(word);
                        else if (word.includes('github.com')) return Contact_Github(word);
                        else if (word.includes('facebook.com')) return Contact_Facebook(word);
                        else if (word.includes('@') && word.includes('.')) return Contact_Email(word);
                        return null;
                    })}
                </div>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (record: string) =>
                record === "Available" ? CircleButton('#2196f3', 'Available')
                    : record === "Rejected" ? CircleButton('#ff4d4f', 'Rejected')
                        : record === "In progress" ? CircleButton('#ffa726', 'In progress')
                            : CircleButton('#4caf50', 'Accepted'),
        },
        {
            title: 'Actions',
            align: 'center',
            render: (_: string, rowData: Candidate) =>
                <div style={{ display: 'flex' }}>
                    <Tooltip title="Delete"><Button type='link' size='small' onClick={() => setDeleteModal({ mode: true, id: rowData.id, file: rowData.resume_file_name })} danger><DeleteOutlined style={{ fontSize: '1.2em' }} /></Button></Tooltip>
                    <Tooltip title="Edit"><Button type='link' size='small' onClick={() => { setSendEmailModal(true); setSelectedCandidate(rowData) }}><EditOutlined style={{ fontSize: '1.2em', color: '#3399FF' }} /></Button></Tooltip>
                    <Tooltip title="Send Email"><Button type='link' size='small' onClick={() => { setSendEmailModal(true); setSelectedCandidate(rowData) }}><SendOutlined style={{ fontSize: '1.2em', color: '#00C851 ' }} /></Button></Tooltip>
                </div>
        },
    ];

    return (
        <>
            <SendEmail state={sendEmailModal} stateFunc={setSendEmailModal} candidate={selectedCandidate} />
            <Discover />
            {/* Candidates */}
            <Divider orientation='left'><DoubleRightOutlined />&nbsp;&nbsp;Candidates List</Divider>
            <Table
                dataSource={DataStore.candidatesData || []}
                loading={DataStore.candidatesData ? false : true}
                // @ts-ignore
                columns={columns}
                size='small'

                style={{ textAlign: 'center' }}
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
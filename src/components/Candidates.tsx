import { observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Space, Table, Divider, message } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd';
import { SearchOutlined, CloseCircleOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import TableKeywordsSearch from './TableKeywordsSearch';
import { FETCHING_DATA_FAILED } from '../utils/validateMessages';

interface DataType {
    first_name: string,
    last_name: string,
    role: string,
    keywords: any,
}

type DataIndex = keyof DataType;

const Candidates: React.FC = observer(() => {
    const [candidates, setCandidates] = useState<any>(null);
    const searchInput = useRef<InputRef>(null);
    const [isLoading, setIsLoading] = useState(true);
    const url = `${process.env.REACT_APP_BASE_URL}/jce/candidates`;

    useEffect(() => {
        fetch(url)
            .then((res) => res.json()
                .then((data) => {
                    if (!data.data)
                        message.error(FETCHING_DATA_FAILED)
                    setCandidates(data.data);
                }).finally(() => setIsLoading(false)));
    }, [url])

    const contact_email = (link: string) =>
        <a key='email' href={`mailto:${link}`}><img style={{ height: '36px' }} alt='Email' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIKdmlld0JveD0iMCAwIDQ4IDQ4Ij4KPHBhdGggZmlsbD0iIzFlODhlNSIgZD0iTTM0LDQySDE0Yy00LjQxMSwwLTgtMy41ODktOC04VjE0YzAtNC40MTEsMy41ODktOCw4LThoMjBjNC40MTEsMCw4LDMuNTg5LDgsOHYyMCBDNDIsMzguNDExLDM4LjQxMSw0MiwzNCw0MnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzUuOTI2LDE3LjQ4OEwyOS40MTQsMjRsNi41MTEsNi41MTFDMzUuOTY5LDMwLjM0NywzNiwzMC4xNzgsMzYsMzBWMTggQzM2LDE3LjgyMiwzNS45NjksMTcuNjUzLDM1LjkyNiwxNy40ODh6IE0yNi42ODgsMjMuODk5bDcuODI0LTcuODI1QzM0LjM0NywxNi4wMzEsMzQuMTc4LDE2LDM0LDE2SDE0IGMtMC4xNzgsMC0wLjM0NywwLjAzMS0wLjUxMiwwLjA3NGw3LjgyNCw3LjgyNUMyMi43OTUsMjUuMzgsMjUuMjA1LDI1LjM4LDI2LjY4OCwyMy44OTl6IE0yNCwyNy4wMDkgYy0xLjQ0LDAtMi44NzMtMC41NDItMy45OS0xLjYwNWwtNi41MjIsNi41MjJDMTMuNjUzLDMxLjk2OSwxMy44MjIsMzIsMTQsMzJoMjBjMC4xNzgsMCwwLjM0Ny0wLjAzMSwwLjUxMi0wLjA3NGwtNi41MjItNi41MjIgQzI2Ljg3MywyNi40NjcsMjUuNDQsMjcuMDA5LDI0LDI3LjAwOXogTTEyLjA3NCwxNy40ODhDMTIuMDMxLDE3LjY1MywxMiwxNy44MjIsMTIsMTh2MTJjMCwwLjE3OCwwLjAzMSwwLjM0NywwLjA3NCwwLjUxMiBMMTguNTg2LDI0TDEyLjA3NCwxNy40ODh6Ij48L3BhdGg+Cjwvc3ZnPg==' /></a>;
    const contact_github = (link: string) =>
        <a key='github' href={`https://${link}`} target='_blank' rel='noreferrer'><img style={{ height: '30px' }} alt='Github' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==' /></a>;
    const contact_linkedin = (link: string) =>
        <a key='linkedin' href={`https://${link}`} target='_blank' rel='noreferrer'><img style={{ height: '36px' }} alt='LinkedIn' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIKdmlld0JveD0iMCAwIDQ4IDQ4Ij4KPHBhdGggZmlsbD0iIzAyODhEMSIgZD0iTTQyLDM3YzAsMi43NjItMi4yMzgsNS01LDVIMTFjLTIuNzYxLDAtNS0yLjIzOC01LTVWMTFjMC0yLjc2MiwyLjIzOS01LDUtNWgyNmMyLjc2MiwwLDUsMi4yMzgsNSw1VjM3eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMiAxOUgxN1YzNkgxMnpNMTQuNDg1IDE3aC0uMDI4QzEyLjk2NSAxNyAxMiAxNS44ODggMTIgMTQuNDk5IDEyIDEzLjA4IDEyLjk5NSAxMiAxNC41MTQgMTJjMS41MjEgMCAyLjQ1OCAxLjA4IDIuNDg2IDIuNDk5QzE3IDE1Ljg4NyAxNi4wMzUgMTcgMTQuNDg1IDE3ek0zNiAzNmgtNXYtOS4wOTljMC0yLjE5OC0xLjIyNS0zLjY5OC0zLjE5Mi0zLjY5OC0xLjUwMSAwLTIuMzEzIDEuMDEyLTIuNzA3IDEuOTlDMjQuOTU3IDI1LjU0MyAyNSAyNi41MTEgMjUgMjd2OWgtNVYxOWg1djIuNjE2QzI1LjcyMSAyMC41IDI2Ljg1IDE5IDI5LjczOCAxOWMzLjU3OCAwIDYuMjYxIDIuMjUgNi4yNjEgNy4yNzRMMzYgMzYgMzYgMzZ6Ij48L3BhdGg+Cjwvc3ZnPg==' /></a>;


    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            close();
                        }}
                    >
                        <CloseCircleOutlined />
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (record: { first_name: any; last_name: any; }) => `${record.first_name} ${record.last_name}`,
            ...getColumnSearchProps('first_name'),
            ...getColumnSearchProps('last_name')
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            ...getColumnSearchProps('role')
        },
        {
            title: 'Experience',
            dataIndex: 'work_experience',
            key: 'work_experience',
            sorter: (a: any, b: any) => a.work_experience - b.work_experience,
        },
        {
            title: 'Resume file',
            dataIndex: 'resume_file_name',
            key: 'resume_file_name',
            render: (record: any) => <a style={{ 'display': 'flex', 'justifyContent': 'center' }} href={`${process.env.REACT_APP_BASE_URL}/jce/resume?file_name=${record}`} target='_blank' rel='noreferrer'><CloudDownloadOutlined /></a>,
        },
        {
            title: 'Contact',
            dataIndex: 'keywords',
            key: 'contact',
            render: (record: any) =>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {record?.map((word: string) => {
                        if (word.includes('linkedin.com/in')) return contact_linkedin(word);
                        else if (word.includes('github.com')) return contact_github(word);
                        else if (word.includes('@') && word.includes('.')) return contact_email(word);
                        return null;
                    })}
                </div>
        },
    ];

    return (
        <>
            <Divider orientation="left">Candidates List</Divider>
            <Table
                dataSource={candidates}
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => { return <TableKeywordsSearch record={record} /> },
                    rowExpandable: (record) => record.first_name !== 'Not Expandable',
                }}
                loading={isLoading}
            />
        </>
    )
});

export default Candidates;
import { useState } from 'react';
import { Button, Dropdown, MenuProps, Tooltip, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import Candidate from '../components/types/Candidate';
import { UPDATE_FAILED, UPDATE_SUCCESS } from './messages';
import dataStore from '../stores/dataStore';

const CandidateStatus: React.FC<{ candidateID: Candidate['id'], resumeFileName: Candidate['resume_file_name'], status: Candidate['status'] }> = (props) => {
    const [currStatus, setCurrStatus] = useState<Candidate['status']>(props.status);

    const colorsMap: { [key: string]: string } = {
        'Available': '#2196f3',
        'Rejected': '#ff4d4f',
        'Accepted': '#4caf50',
        'In Progress': '#ffa726'
    };

    const statusCircle = (status: string) =>
        <Tooltip title={status}>
            <Button type='text'
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: colorsMap[status],
                }}
                icon={<CheckCircleOutlined style={{ color: '#fff' }} />}
            />
        </Tooltip>

    const onClick: MenuProps['onClick'] = async ({ key }) => {
        const selectedItem = items?.find(item => item?.key === key);
        if (selectedItem) {
            //@ts-ignore
            setCurrStatus(selectedItem?.key)
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/candidates/${props.candidateID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newStatus: selectedItem?.key,
                        resumeFileName: props.resumeFileName,
                    })
                });
                const data = await response.json();
                if (response.ok && data?.statusCode === 200) {
                    message.success(UPDATE_SUCCESS('Candidate status'))
                    dataStore.candidatesData?.forEach((candidate) => {
                        if (candidate.id === props.candidateID) {
                            //@ts-ignore
                            candidate.status = selectedItem.key;
                        }
                    });
                } else {
                    throw Error(data?.error);
                }
            } catch (error) {
                message.error(UPDATE_FAILED('Candidate status'))
                console.error(error);
            }
        }
    };

    const items: MenuProps['items'] = [
        {
            label: statusCircle('Available'),
            key: 'Available',
        },
        {
            label: statusCircle('Accepted'),
            key: 'Accepted',
        },
        {
            label: statusCircle('In Progress'),
            key: 'In Progress',
        },
        {
            label: statusCircle('Rejected'),
            key: 'Rejected',
        },
    ];

    return (
        <div style={{ width: 'min-content' }}>
            <Dropdown menu={{ items, onClick }} trigger={['click']}>
                {statusCircle(currStatus)}
            </Dropdown>
        </div >
    )
}

export default CandidateStatus;
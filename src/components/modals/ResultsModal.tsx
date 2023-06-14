import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, Divider, Tag, InputNumber, Form, Badge, List, Avatar, Button } from 'antd';
import RelevantCandidate from '../types/RelevantCandidate';
import VirtualList from 'rc-virtual-list';
import SendEmail from './SendEmailModal';
import Candidate from '../types/Candidate';

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>,
    data: RelevantCandidate[],
}

const ResultsModal: React.FC<modalProps> = (props) => {
    const [minScore, setMinScore] = useState(0);
    const [sendEmailModal, setSendEmailModal] = useState<boolean>(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();

    const closeModelHandler = () => {
        setMinScore(0);
        props.stateFunc(false);
    }

    return (
        <>
            <SendEmail state={sendEmailModal} stateFunc={setSendEmailModal} candidate={selectedCandidate} />
            <Modal
                title={<Divider orientation='left'>Matching Results</Divider>}
                open={props.state}
                onCancel={closeModelHandler}
                footer={<Button block onClick={closeModelHandler} type='default'>OK</Button>}
                confirmLoading={false}
                centered
            >
                {/* Minimum Score */}
                <Form.Item label='Minimum score to show: '>
                    <InputNumber value={minScore} onChange={(num: any) => setMinScore(Number(num))} min={0} step={0.1} />
                </Form.Item>

                {/* Search Results */}
                {typeof (props.data) !== 'undefined' && props.data && props.data.length > 0 ?
                    <>
                        <List key={props.data[0].candidate?.id}>
                            <VirtualList
                                data={props.data}
                                height={450}
                                itemKey={(item: any) => item.id}
                            >
                                {(item: any, index: number) => {
                                    if (item?.score >= minScore) {
                                        return (
                                            <List.Item key={`${item}--${index}`}>
                                                <List.Item.Meta
                                                    avatar={null}
                                                    title={
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <div style={{ justifyContent: 'flex-start' }}>
                                                                <span style={{ marginRight: '10px' }}>
                                                                    <Badge count={index + 1} offset={[-15, 15]} color='#222061'><Avatar size={30} style={{ backgroundColor: '#aed8e6' }} /></Badge>
                                                                </span>
                                                                {item.candidate?.first_name + ' ' + item.candidate?.last_name}
                                                            </div>
                                                            <div style={{ justifyContent: 'flex-end' }} key={Math.floor(Math.random() * Date.now())}>
                                                                <Button type='link' size='small' onClick={() => { setSendEmailModal(true); setSelectedCandidate(item.candidate) }}>
                                                                    Invite
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    }
                                                    description={
                                                        <>
                                                            <b>Keywords Matches:</b>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBlockEnd: '10px' }}>
                                                                {item.keywordsMatches.map((keyword: string, index: number) => <Tag color='green' key={`${index}-${keyword}`}>{keyword}</Tag>)}
                                                            </div>
                                                            <b>Score:</b> {item.score}
                                                        </>
                                                    }
                                                    style={{ border: '1px solid #e2e2e2', borderRadius: '10px', padding: '10px' }}
                                                />
                                            </List.Item>
                                        )
                                    } else
                                        return (<></>)
                                }}
                            </VirtualList>
                        </List>
                    </> : 'No matches, try again'
                }
            </Modal >
        </>
    )
};

export default ResultsModal;
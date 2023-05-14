import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, Divider, Tag, InputNumber, Form, Badge, List, Avatar, Button } from 'antd';
import RelevantCandidate from '../types/RelevantCandidate';

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>,
    data: RelevantCandidate[],
}

const ResultsModal: React.FC<modalProps> = (props) => {
    const [minScore, setMinScore] = useState(0);

    const closeModelHandler = () => {
        setMinScore(0);
        props.stateFunc(false);
    }

    return (
        <Modal
            title={<Divider orientation='left'>Matching Results</Divider>}
            open={props.state}
            onCancel={closeModelHandler}
            footer={<Button block onClick={closeModelHandler} type='default'>OK</Button>}
            confirmLoading={false}
        >
            {/* Minimum Score */}
            <Form.Item label='Minimum score to show: '>
                <InputNumber value={minScore} onChange={(num: any) => setMinScore(Number(num))} min={0} step={0.1} />
            </Form.Item>

            {/* Search Results */}
            {typeof (props.data) !== 'undefined' && props.data && props.data.length > 0 ?
                <>
                    <List
                        itemLayout='horizontal'
                        dataSource={props.data}
                        renderItem={(item, index) => {
                            if (item.score >= minScore)
                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                            key={index}
                                            avatar={null}
                                            title={<><span style={{ marginRight: '10px' }}><Badge count={index + 1} offset={[-15, 15]} color='#222061' ><Avatar size={30} style={{ backgroundColor: '#aed8e6' }} /></Badge></span>{item.candidate?.first_name + ' ' + item.candidate?.last_name}</>}
                                            description={
                                                <>
                                                    <b>Keywords Matches:</b>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBlockEnd: '10px' }}>
                                                        {item.keywordsMatches.map((keyword: string, index: number) => <Tag color='green' key={index}>{keyword}</Tag>)}
                                                    </div>
                                                    <b>Score:</b> {item.score}
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )
                        }}
                        bordered
                    />
                </> : 'No matches, try again'}
        </Modal>
    )
};

export default ResultsModal;
import React, { Dispatch, SetStateAction } from "react";
import { Modal, Descriptions, Tag } from "antd";
import Candidate from "../types/Candidate";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>,
    candidate: Candidate | undefined,
}

const CandidateCard: React.FC<modalProps> = (props) => {
    const keywordsMap = new Map(Object.entries(props.candidate?.keywords || []));
    const keywordsSortedMap = new Map(
        Array.from(keywordsMap).sort(([, valueA], [, valueB]) => valueB - valueA)
    );

    const calculateTagColor = (value: number) => {
        const colorScale = [
            '#f9f6da',
            '#daf9da',
            '#daf1f9',
            '#dadaf9',
            '#f9dada'
        ];
        const index = Math.floor((value / keywordsSortedMap.values().next().value) * (colorScale.length - 1));
        return colorScale[index];
    }

    return (
        <Modal
            open={props.state}
            onCancel={() => props.stateFunc(false)}
            footer={null}
            confirmLoading={false}
        >
            <div>
                <Descriptions
                    layout="vertical"
                    title={`${props.candidate?.first_name} ${props.candidate?.last_name}`}
                    size={'small'}
                    bordered
                >
                    <Descriptions.Item label="Keywords (Sorted by Frequency)">
                        {Array.from(keywordsSortedMap.entries()).map(([keyword, value], index) => (
                            <Tag
                                key={index}
                                style={{ backgroundColor: calculateTagColor(value) }}
                            >
                                {keyword} {value > 1 ? `(${value})` : ''}
                            </Tag>
                        ))}
                    </Descriptions.Item>
                </Descriptions>
            </div>

        </Modal >
    )
};

export default CandidateCard;
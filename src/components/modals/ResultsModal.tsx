import React, { Dispatch, SetStateAction } from "react";
import { Modal, Divider } from "antd";
import type Candidate from "../types/Candidate";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>,
    data: Candidate[] | undefined,
}

const ResultsModal: React.FC<modalProps> = (props) => {

    return (
        <Modal
            title={<Divider orientation="left">Matching Results</Divider>}
            open={props.state}
            onOk={() => props.stateFunc(false)}
            onCancel={() => props.stateFunc(false)}
            confirmLoading={false}
        >
            {/* Search Results */}
            {typeof (props.data) !== 'undefined' ? (props.data && props.data.length > 0 ? props.data.map((candidate, index) =>
                <>
                    <h2>{candidate.first_name} {candidate.last_name}</h2>
                    <b><u>Score:</u></b> {candidate.score.toPrecision(3)}
                </>
            ) : 'No matches, try again') : ''}
        </Modal>
    )
};

export default ResultsModal;
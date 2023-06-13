import { Dispatch, SetStateAction, useState } from "react";
import { Modal, message } from "antd";
import dataStore from "../../stores/dataStore";
import Candidate from "../types/Candidate";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DELETE_SUCCESS, DELETE_SURE } from "../../utils/messages";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>,
    candidate: Candidate | undefined,
}

const DeleteCandidateModal: React.FC<modalProps> = (props) => {

    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const url_candidates = `${process.env.REACT_APP_BASE_URL}/candidates`;

    const deleteCandidate = () => {
        setDeleteLoading(true);
        fetch(`${url_candidates}?id=${props?.candidate?.id}&file=${props?.candidate?.resume_file_name}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(props?.candidate?.keywords),

        })
            .then(response => response.json().then((data) => {
                if (data.statusCode === 200) {
                    message.success(DELETE_SUCCESS("Candidate"));
                    dataStore.fetchCandidatesData(true);
                    dataStore.fetchKeywordsData(true);
                } else {
                    message.error(data?.error);
                }
                props.stateFunc(false);
                setDeleteLoading(false);
            }))
    }

    return (
        <Modal
            onOk={() => deleteCandidate()}
            onCancel={() => props.stateFunc(false)}
            open={props.state}
            title={
                <>
                    <ExclamationCircleOutlined style={{ fontSize: '1.5em', color: 'red' }} />
                    <p style={{ marginBlockEnd: '20px' }}>
                        {DELETE_SURE(`candidate ${props.candidate?.first_name} ${props.candidate?.last_name}`)}
                    </p>
                </>
            }
            confirmLoading={deleteLoading}
            okButtonProps={{ style: { backgroundColor: 'red' } }}
        />
    )
}

export default DeleteCandidateModal;
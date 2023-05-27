import { Modal, Button } from "antd";

const ErrorDataModal = () => {
    Modal.error({
        title: 'Error Occurred',
        content:
            <>
                <p>Not all data was loaded successfully.</p>
                <p>Please refresh the page to try load again.</p>
                <Button onClick={() => document.location.reload()} type="primary" block danger>Refresh</Button>
            </>,
        footer: ''
    });

    return null;
}

export default ErrorDataModal;
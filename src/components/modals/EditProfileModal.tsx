import React, { Dispatch, SetStateAction } from "react";
import { Modal, Form, Input, message, Divider } from "antd";
import userStore from "../../stores/userStore";
import firebase from "../../firebase/firebase";
import type { FormInstance } from 'antd/es/form';
import { MISSING_FIELD, REAUTHENTICATION_MSG, VALID_EMAIL } from "../../utils/messages";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

const EditProfileModal: React.FC<modalProps> = (props) => {
    const profileFormRef = React.useRef<FormInstance>(null);

    const handleUpdateProfile = () => {
        const { name, email } = profileFormRef?.current?.getFieldsValue(["name", "email"]);
        try {
            firebase.doUpdateProfile(name, email);
            message.success("Profile details have been updated successfully")
            props.stateFunc(false);
        } catch (error) {
            message.error("Sorry, we were unable to update your profile details. Please try again later")
        }
    };

    const user = userStore.userInfo;
    const reAuthenticationNeeded = !firebase.auth.currentUser!?.metadata?.lastSignInTime ? true : false;

    return (
        <Modal
            title={<Divider orientation="left">Edit Profile</Divider>}
            open={props.state}
            onOk={() => handleUpdateProfile()}
            onCancel={() => props.stateFunc(false)}>
            <Form
                ref={profileFormRef}
                initialValues={{ name: user?.displayName, email: user?.email }}
                layout="vertical"
            >
                <Form.Item label="Name" name="name" rules={[{
                    type: 'string',
                    required: true,
                    message: MISSING_FIELD('Name')
                }]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{
                    type: 'email',
                    required: true,
                    message: VALID_EMAIL,
                }]} hasFeedback>
                    <Input type="email" disabled={reAuthenticationNeeded} />
                </Form.Item>
                <Form.Item style={{ marginBlockStart: -30 }} validateStatus="warning" help={reAuthenticationNeeded ? REAUTHENTICATION_MSG : ""}></Form.Item>
            </Form>
        </Modal>
    )
};

export default EditProfileModal;
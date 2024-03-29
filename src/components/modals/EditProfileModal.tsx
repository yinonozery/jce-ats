import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Form, Input, message, Divider } from "antd";
import userStore from "../../stores/userStore";
import firebase from "../../firebase/firebase";
import { REAUTHENTICATION_MSG, VALID_EMAIL } from "../../utils/messages";
import { observer } from "mobx-react";
import { FormInstance, useForm } from "antd/es/form/Form";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

const EditProfileModal: React.FC<modalProps> = (props) => {
    const profileFormRef: FormInstance<any> = useForm()[0];

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        profileFormRef.setFields([{ name: "name", value: userStore.userInfo?.displayName }, { name: "email", value: userStore.userInfo?.email }]);
    }, [profileFormRef, props.state]);

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        const { name, email } = profileFormRef?.getFieldsValue(["name", "email"]);
        try {
            await firebase.doUpdateProfile(name, email);
            message.success("Profile details have been updated successfully");
        } catch (error) {
            message.error("Sorry, we were unable to update your profile details. Please try again later");
        } finally {
            props.stateFunc(false);
            setIsLoading(false);
        }
    };

    const reAuthenticationNeeded = !firebase.auth.currentUser!?.metadata?.lastSignInTime ? true : false;

    return (
        <Modal
            title={<Divider orientation="left">Edit Profile</Divider>}
            open={props.state}
            onOk={() => handleUpdateProfile()}
            onCancel={() => props.stateFunc(false)}
            confirmLoading={isLoading}
        >
            <Form
                form={profileFormRef}
                initialValues={{ name: userStore.userInfo?.displayName, email: userStore.userInfo?.email }}
                layout="vertical"
            >
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{
                    type: 'email',
                    required: true,
                    message: VALID_EMAIL,
                }]}>
                    <Input type="email" disabled={reAuthenticationNeeded} />
                </Form.Item>
                <Form.Item style={{ marginBlockStart: -30 }} validateStatus="warning" help={reAuthenticationNeeded ? REAUTHENTICATION_MSG : ""}></Form.Item>
            </Form>
        </Modal>
    )
};

export default observer(EditProfileModal);
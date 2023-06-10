import React, { Dispatch, SetStateAction } from "react";
import { Modal, Form, Input, message, Divider } from "antd";
import firebase from "../../firebase/firebase";
import type { FormInstance } from 'antd/es/form';
import { MISSING_FIELD, REAUTHENTICATION_MSG, PASSWORD_CONFIRMATION, FIELD_MIN_LENGTH } from "../../utils/messages";

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

const ChangePasswordModal: React.FC<modalProps> = (props) => {
    const profileFormRef = React.useRef<FormInstance>(null);
    const reAuthenticationNeeded = !firebase.auth.currentUser!?.metadata?.lastSignInTime ? true : false;

    const handleChangePassword = async () => {
        const { newPassword } = profileFormRef?.current?.getFieldsValue(["password"]);

        try {
            if (newPassword.length < 6)
                throw new Error("Password should be at least 6 characters");
            await firebase.doChangePassword(newPassword);
            message.success("Password have been changed successfully")
            props.stateFunc(false);
        } catch (error) {
            console.log(error);
            message.error("Sorry, we were unable to change your password. Please try again later")
        }
    };

    return (
        <Modal
            title={<Divider orientation="left">Change Password</Divider>}
            open={props.state}
            onOk={() => reAuthenticationNeeded ? handleChangePassword() : null}
            onCancel={() => props.stateFunc(false)}
            confirmLoading={false}
        >
            <Form
                ref={profileFormRef}
                layout="vertical"
            >
                <Form.Item label="Password" name="password" rules={[
                    {
                        required: true,
                        message: MISSING_FIELD('Password')
                    },
                    {
                        min: 6,
                        message: FIELD_MIN_LENGTH("Password", 6),
                    }]}>
                    <Input.Password disabled={reAuthenticationNeeded} />
                </Form.Item>
                <Form.Item label="Confirm Password" name="confirm"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: PASSWORD_CONFIRMATION,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]} hasFeedback>

                    <Input type="password" disabled={reAuthenticationNeeded} />
                </Form.Item>
                <Form.Item style={{ marginBlockStart: -30 }} validateStatus="warning" help={reAuthenticationNeeded ? REAUTHENTICATION_MSG : ""}></Form.Item>
            </Form>
        </Modal>
    )
};

export default ChangePasswordModal;
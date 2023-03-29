import React, { useState, useEffect } from "react";
import firebase from "../../firebase/firebase";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Divider, Modal } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import appConfig from "../../stores/appStore";
import { MISSING_FIELD, VALID_EMAIL } from "../../utils/validateMessages";

type loginForm = {
    email: string,
    password: string
    remember: boolean
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo)
            navigate('/')
    }, [navigate])

    const resetPassword = async (email: string) => {
        appConfig.loadingHandler(true);
        try {
            await firebase.doResetPassword(email);
            message.success(`${resetEmail} We've sent an email with instructions to reset your password. Please check your inbox and follow the instructions provided.`)
        } catch (err: any) {
            message.error(err?.code)
        } finally {
            appConfig.loadingHandler(false);
        }
    }

    const onFinish = async (userDetails: loginForm) => {
        appConfig.loadingHandler(true);
        try {
            await firebase.doSignInWithEmailAndPassword(userDetails.email, userDetails.password);
            navigate('/');
        } catch (err: any) {
            message.error(err?.code)
        } finally {
            appConfig.loadingHandler(false);
        }
    }

    return (
        <>
            <Divider>Login</Divider>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={(e) => { onFinish(e); }}
            >

                {/* Email */}
                <Form.Item
                    name="email"
                    rules={[{ type: 'email', required: true, message: VALID_EMAIL }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: MISSING_FIELD('password') }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="input password"
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    />
                </Form.Item>

                {/* Forgot Password + Modal */}
                <Modal title={<Divider>Reset password</Divider>} open={isModalOpen} footer={[]} onCancel={() => setIsModalOpen(false)}>
                    <Form.Item
                        name="emailReset"
                        rules={[{ type: 'email', required: true, message: VALID_EMAIL }]}
                        hasFeedback
                    >
                        <Input type="email" onChange={(email) => setResetEmail(email.currentTarget.value)} name="resetEmail" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}><Button type="default" onClick={() => { resetPassword(resetEmail) }}>Submit</Button></div>
                </Modal>
                <Form.Item>
                    <Link className="login-form-forgot" to="#" onClick={() => setIsModalOpen(true)}>
                        Forgot password
                    </Link>
                </Form.Item>

                {/* Submit button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>

                    {/* Remember me */}
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox style={{ 'marginLeft': 10 }}>Remember me</Checkbox>
                    </Form.Item>

                </Form.Item>
            </Form>
        </>
    )
}

export default Login;
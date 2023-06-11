import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/firebase';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Divider, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import appConfig from '../../stores/appStore';
import { FORGOT_PASS_SUCCESS, WRONG_EMAIL, MISSING_FIELD, VALID_EMAIL, WRONG_PASSWORD } from '../../utils/messages';

type loginForm = {
    email: string,
    password: string
    remember: boolean
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo)
            navigate('/')
    }, [navigate])

    const onFinish = async (userDetails: loginForm) => {
        appConfig.loadingHandler(true);
        try {
            await firebase.doSignInWithEmailAndPassword(userDetails.email, userDetails.password);
            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/user-not-found')
                message.error(WRONG_EMAIL)
            else if (err.code === 'auth/wrong-password')
                message.error(WRONG_PASSWORD)
        } finally {
            appConfig.loadingHandler(false);
        }
    }

    const resetPassword = async (values: any) => {
        const { emailReset } = values;
        try {
            await firebase.doResetPassword(emailReset);
            message.success(FORGOT_PASS_SUCCESS)
            setForgotPasswordModal(false);
        } catch (err: any) {
            if (err.code === 'auth/user-not-found')
                message.error(WRONG_EMAIL)
        }
    }

    return (
        <>
            <Divider>Login</Divider>
            <Form
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >

                {/* Email */}
                <Form.Item
                    name='email'
                    rules={[{ type: 'email', required: true, message: VALID_EMAIL }]}
                >
                    <Input prefix={<UserOutlined />} placeholder='Email' />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name='password'
                    rules={[{ required: true, message: MISSING_FIELD('password') }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder='input password'
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    />
                </Form.Item>

                {/* Forgot Password */}
                <Form.Item>
                    <Button type='link' onClick={() => setForgotPasswordModal(true)}>
                        Forgot password
                    </Button>
                </Form.Item>

                {/* Submit button */}
                <Button type='primary' htmlType='submit'>
                    Log in
                </Button>

                {/* Remember me */}
                <Form.Item name='remember' valuePropName='checked' noStyle>
                    <Checkbox style={{ 'marginLeft': '10px' }}>Remember me</Checkbox>
                </Form.Item>
            </Form>

            {/* Forgot Password Modal */}
            <Modal title={<Divider>Reset password</Divider>} open={forgotPasswordModal} footer={[]} onCancel={() => setForgotPasswordModal(false)}>
                <Form onFinish={resetPassword}>
                    <Form.Item
                        name='emailReset'
                        rules={[{ type: 'email', required: true, message: VALID_EMAIL }]}
                        hasFeedback
                    >
                        <Input type='email' prefix={<UserOutlined />} placeholder='Email' />
                    </Form.Item>
                    <Button type='primary' htmlType='submit' block>Submit</Button>
                </Form>
            </Modal>
        </>
    )
}

export default Login;
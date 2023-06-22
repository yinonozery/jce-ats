import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/firebase';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Divider, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import appConfig from '../../stores/appStore';
import { FORGOT_PASS_SUCCESS, WRONG_EMAIL, MISSING_FIELD, VALID_EMAIL, WRONG_PASSWORD } from '../../utils/messages';
import { FormInstance, useForm } from 'antd/es/form/Form';

type loginForm = {
    email: string,
    password: string
    remember: boolean
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form: FormInstance<any> = useForm()[0];

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
        setIsLoading(true);
        try {
            await firebase.doResetPassword(emailReset);
            message.success(FORGOT_PASS_SUCCESS)
            setForgotPasswordModal(false);
            form.resetFields();
        } catch (err: any) {
            if (err.code === 'auth/user-not-found')
                message.error(WRONG_EMAIL)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={{ paddingInline: '50px' }}>
            <Divider>Login</Divider>
            <Form
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout='horizontal'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 20 }}
                labelAlign='right'
            >

                {/* Email */}
                <Form.Item
                    name='email'
                    rules={[{ type: 'email', required: true, message: VALID_EMAIL }]}
                    label='Email'
                    required={false}
                >
                    <Input prefix={<UserOutlined />} placeholder='Email' />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name='password'
                    rules={[{ required: true, message: MISSING_FIELD('password') }]}
                    label='Password'
                    required={false}
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
            <Modal title={<Divider>Reset password</Divider>} open={forgotPasswordModal} footer={[]} onCancel={() => { setForgotPasswordModal(false); form.resetFields() }}>
                <Form form={form} onFinish={resetPassword}>
                    <Form.Item
                        name='emailReset'
                        rules={[{ type: 'email', required: true, message: VALID_EMAIL }]}
                    >
                        <Input type='email' prefix={<UserOutlined />} placeholder='Email' />
                    </Form.Item>
                    <Button type='primary' htmlType='submit' loading={isLoading} block>Submit</Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Login;
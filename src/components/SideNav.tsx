import React, { Dispatch, SetStateAction, useState } from 'react';
import firebase from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Menu, Modal, MenuProps, Avatar, Divider, Dropdown, theme } from 'antd';
import { ExclamationCircleOutlined, LaptopOutlined, ReadOutlined, NotificationOutlined, UserOutlined, FacebookOutlined, GlobalOutlined, InstagramOutlined, LoginOutlined, LogoutOutlined, FileAddOutlined, SolutionOutlined, QuestionOutlined, ContainerOutlined } from '@ant-design/icons';
import userStore from '../stores/userStore';
import { LOG_OUT_QUESTION } from '../utils/messages';
import EditProfileModal from './modals/EditProfileModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import appConfig from '../stores/appStore';
import { observer } from 'mobx-react';
import Sider from 'antd/es/layout/Sider';
import CurrentTime from '../utils/CurrentTime';

interface modalProps {
    state: number,
    stateFunc: Dispatch<SetStateAction<number>>,
}

const SideNav: React.FC<modalProps> = (props) => {
    const navigate = useNavigate();
    const [logoutModal, setLogoutModal] = useState(false);
    const [editProfileModal, setEditProfileModal] = useState(false);
    const [changePassModal, setChangePassModal] = useState(false);

    const sideMenuItems = [
        { index: 0, icon: UserOutlined, label: 'Home', path: '/', subItems: [] },
        { index: 1, icon: LaptopOutlined, label: 'About', path: '/about', subItems: [] },
        {
            index: 6, icon: NotificationOutlined, label: 'Contact Us', path: '#', subItems:
                [
                    { icon: FacebookOutlined, label: 'Facebook', path: 'https://www.facebook.com/JCE.IL' },
                    { icon: InstagramOutlined, label: 'Instagram', path: 'https://www.instagram.com/aguda.jce' },
                    { icon: GlobalOutlined, label: 'Official Website', path: 'https://www.jce.ac.il' },
                ]
        },
        { index: 9, icon: QuestionOutlined, label: 'Help', path: '/help', subItems: [] },
    ];

    if (userStore.userInfo) {
        // Logged-in
        sideMenuItems.push(
            { index: 2, icon: SolutionOutlined, label: 'Candidates', path: '/candidates', subItems: [] },
            { index: 3, icon: ReadOutlined, label: 'Courses', path: '/courses', subItems: [] },
            { index: 4, icon: ContainerOutlined, label: 'Email Templates', path: '/email-templates', subItems: [] },
            { index: 5, icon: FileAddOutlined, label: 'Add Candidate', path: '/add-candidate', subItems: [] },
            { index: 9, icon: LogoutOutlined, label: 'Logout', path: '/logout', subItems: [] },
        );
    } else {
        // Logout
        sideMenuItems.push(
            { index: 2, icon: LoginOutlined, label: 'Admin Login', path: '/login', subItems: [], }
        )
    }

    sideMenuItems.sort((a, b) => a.index - b.index); // Sort menu order by index

    const menu: MenuProps['items'] =
        sideMenuItems
            .map(
                (item, index) => {
                    return {
                        key: `${index}`,
                        icon: React.createElement(item.icon),
                        label: item.label,
                        path: item.path,
                        children: item.subItems.length > 0 ? item.subItems.map((subItem, index) => {
                            return {
                                key: `sub${index}`,
                                icon: React.createElement(subItem.icon),
                                label: subItem.label,
                                path: subItem.path,
                            };
                        }) : null,
                    };
                },
            );

    const items: MenuProps['items'] = [
        {
            key: '1',
            title: '',
            label: (
                <span onClick={() => setEditProfileModal(true)}>
                    Edit Profile
                </span>
            ),
        },
        {
            key: '2',
            title: '',
            label: (
                <span onClick={() => setChangePassModal(true)}>
                    Change Password
                </span>
            ),
        },
    ];

    const signOut = () => {
        firebase.doSignOut();
        userStore.setUser(null);
        navigate('/');
        setLogoutModal(false)
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <Sider
                width={200}
                style={{
                    background: colorBgContainer,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflowX: 'hidden',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    zIndex: 1,
                }}
                onCollapse={(smaller) => {
                    if (smaller)
                        props.stateFunc(80)
                    else
                        props.stateFunc(200)
                }}
                breakpoint='xl'
            >
                <Modal
                    title={
                        <>
                            <ExclamationCircleOutlined style={{ fontSize: '1.5em', color: 'red' }} />
                            <p style={{ marginBlockEnd: '20px' }}>
                                {LOG_OUT_QUESTION}
                            </p>
                        </>
                    }
                    open={logoutModal}
                    onOk={signOut}
                    onCancel={() => setLogoutModal(false)}
                    okButtonProps={{ style: { backgroundColor: 'red' } }}
                />
                <EditProfileModal state={editProfileModal} stateFunc={setEditProfileModal} />
                <ChangePasswordModal state={changePassModal} stateFunc={setChangePassModal} />
                {userStore.userInfo ?
                    <Divider style={{ borderBlockStartColor: '#8db286' }}>
                        <Dropdown menu={{ items }} placement='bottom' arrow >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBlock: '15px', borderRadius: '10px', padding: 5, boxShadow: 'rgba(0, 0, 0, 0.2) 0px 18px 50px -10px', maxWidth: '160px' }}>
                                <Avatar shape='square' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                <span style={{ display: 'inline-block', marginInline: 'auto', maxWidth: '150px', wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {props.state === 80 ? (
                                        userStore.userInfo.displayName ? (
                                            userStore.userInfo.displayName.charAt(0).toUpperCase()
                                        ) : (
                                            userStore.userInfo.email?.charAt(0).toUpperCase()
                                        )
                                    ) : (
                                        userStore.userInfo.displayName || userStore.userInfo.email
                                    )}
                                </span>
                            </div>
                        </Dropdown>
                    </Divider>
                    : null}
                <Menu
                    mode='inline'
                    inlineIndent={15}
                    selectedKeys={[String(sideMenuItems.find((item) => item.path === `/${appConfig?.currPage}`)?.index)]}
                    defaultOpenKeys={['8']}
                    items={menu}
                    onClick={(clicked) => {
                        let res = menu?.find((item) => item?.key === (clicked.keyPath.length < 2 ? clicked?.keyPath[0] : clicked?.keyPath[1]))
                        // @ts-ignore
                        if (res?.label === 'Logout')
                            return setLogoutModal(true);
                        if (clicked.keyPath.length > 1) {
                            // @ts-ignore
                            res = res?.children.find((child) => child?.key === clicked.keyPath[0]);
                            // @ts-ignore
                            return window.open(res.path, '_blank')
                        }
                        // @ts-ignore
                        return navigate(res?.path, { replace: true })
                    }}
                />
                <CurrentTime />
            </Sider>
        </>
    )
}

export default observer(SideNav);
import React from "react";
import firebase from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Menu, Modal, MenuProps } from 'antd';
import { LaptopOutlined, ReadOutlined, NotificationOutlined, UserOutlined, FacebookOutlined, GlobalOutlined, InstagramOutlined, LoginOutlined, LogoutOutlined, FileAddOutlined, SolutionOutlined, QuestionOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import userStore from "../stores/userStore";

const SideNav: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const sideMenuItems = [{
        index: 0, icon: UserOutlined, label: 'Home', path: '/', subItems: []
    },
    { index: 1, icon: LaptopOutlined, label: 'About', path: '/about', subItems: [] },
    {
        index: 6, icon: NotificationOutlined, label: 'Contact Us', path: '#', subItems: [
            { icon: FacebookOutlined, label: 'Facebook', path: 'https://www.facebook.com/JCE.IL' },
            { icon: InstagramOutlined, label: 'Instagram', path: 'https://www.instagram.com/aguda.jce' },
            { icon: GlobalOutlined, label: 'Official Website', path: 'https://www.jce.ac.il' },
        ]
    },
    { index: 7, icon: QuestionOutlined, label: 'Help', path: '#', subItems: [] },
    ];

    if (userStore.userInfo !== null)
        // Logged-in
        sideMenuItems.push(
            { index: 8, icon: LogoutOutlined, label: 'Logout', path: '/logout', subItems: [] },
            { index: 2, icon: SolutionOutlined, label: 'Candidates', path: '/candidates', subItems: [] },
            { index: 3, icon: ReadOutlined, label: 'Courses', path: '/courses', subItems: [] },
            { index: 4, icon: FileAddOutlined, label: 'Add Candidate', path: '/addResume', subItems: [] },
            { index: 5, icon: AppstoreAddOutlined, label: 'Add Course', path: '/addCourse', subItems: [] },
        );
    else
        // Logout
        sideMenuItems.push(
            {
                index: 1, icon: LoginOutlined, label: 'Admin Login', path: '/login', subItems: [],
            }
        )

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

    return (
        <>
            <Modal
                title="Logout"
                open={open}
                onOk={() => firebase.doSignOut()}
                onCancel={() => setOpen(false)}
            >
                <p>{"Are you sure you want to log out?"}</p>
            </Modal>
            <Menu
                mode="inline"
                inlineIndent={15}
                defaultSelectedKeys={['0']}
                defaultOpenKeys={['3']}
                style={{ height: '100%', borderRight: 0 }}
                items={menu}
                onClick={(clicked) => {
                    let res = menu.find((item) => item?.key === (clicked.keyPath.length < 2 ? clicked?.keyPath[0] : clicked?.keyPath[1]))
                    // @ts-ignore
                    if (res.label === 'Logout')
                        return setOpen(true);
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
        </>
    )
}

export default SideNav;
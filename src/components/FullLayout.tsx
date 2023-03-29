
import { Breadcrumb, Layout, theme } from 'antd';
import HeaderNav from './Header';
import SideNav from './SideNav';
import userStore from '../stores/userStore';
import React, { useState } from 'react';
import type { ReactNode } from 'react';
const { Content, Sider, Footer } = Layout;

type childrenProps = {
    children: ReactNode,
}

const FullLayout: React.FC<childrenProps> = (props) => {
    const [marginResponsive, setMarginResponsive] = useState(200)

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <>
            <Layout hasSider>
                <Layout>
                    <Sider width={200} style={{
                        background: colorBgContainer, overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                        onCollapse={(smaller) => {
                            if (smaller)
                                setMarginResponsive(80)
                            else
                                setMarginResponsive(200)
                        }}
                        breakpoint="md">

                        <SideNav />
                    </Sider>
                    <Layout className="site-layout" style={{ marginLeft: (marginResponsive) }} >
                        <HeaderNav />
                        <div style={{ padding: '14px 16px 0' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Careers Center</Breadcrumb.Item>
                                {userStore.userInfo ?
                                    <Breadcrumb.Item>Welcome {userStore.userInfo.email}</Breadcrumb.Item> : null}
                            </Breadcrumb>
                            <Content
                                style={{
                                    padding: '30px',
                                    margin: '0 auto',
                                    minWidth: 'fit-content',
                                    maxWidth: 'min(100%, 450px)',
                                    background: colorBgContainer,
                                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
                                }}
                            >
                                {props.children}
                            </Content>
                        </div>
                        <Footer style={{ textAlign: 'center', marginTop: '5px', backgroundColor: 'transparent', bottom: '0' }}>
                            JCE Careers Final Project &copy; 2023 Created by Yinon Ozery
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default FullLayout;
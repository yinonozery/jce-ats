
import { Breadcrumb, Layout, theme } from 'antd';
import HeaderNav from './Header';
import SideNav from './SideNav';
import userStore from '../stores/userStore';
import React, { useState, ReactNode, useEffect } from 'react';
import AppConfig from '../stores/appStore';
import { observer } from 'mobx-react';

const { Content, Sider, Footer } = Layout;

const FullLayout: React.FC<{ children: ReactNode }> = observer((props) => {
    const [marginResponsive, setMarginResponsive] = useState(200)
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: undefined }));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: undefined }));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const setPath = (pathname: string | null) => {
        window.document.title = process.env.REACT_APP_WINDOW_TITLE || '';
        if (pathname) {
            const splitStr = pathname.split('-');
            const words = splitStr.map((word) => {
                const firstLetter = word.charAt(0).toUpperCase();
                const restOfWord = word.slice(1).toLowerCase();
                return firstLetter + restOfWord;
            });
            window.document.title = process.env.REACT_APP_WINDOW_TITLE + " " + words.join(' ');
            return words.join(' ');
        }
    };


    return (
        <>
            <Layout hasSider>
                <Layout>
                    <Sider
                        width={200}
                        style={{
                            background: colorBgContainer,
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            overflowY: 'auto',
                            boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                        }}
                        onCollapse={(smaller) => {
                            if (smaller)
                                setMarginResponsive(80)
                            else
                                setMarginResponsive(200)
                        }}
                        breakpoint="md"
                    >
                        <SideNav smaller={marginResponsive === 80 ? true : false} />
                        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center', margin: 10, fontSize: '.9em' }}>
                            {currentTime}
                        </div>
                    </Sider>
                    <Layout className="site-layout" style={{ marginLeft: (marginResponsive) }} >
                        <HeaderNav>
                            <div style={{ position: 'fixed', marginLeft: '20px', left: marginResponsive, marginTop: '30px', color: 'black' }}>
                                <Breadcrumb style={{ margin: '16px 0px', position: 'fixed' }}>
                                    {userStore.userInfo && AppConfig.currPage
                                        ? <><Breadcrumb.Item >Careers Center</Breadcrumb.Item>
                                            <Breadcrumb.Item>{setPath(AppConfig.currPage)}</Breadcrumb.Item></>
                                        : <Breadcrumb.Item >Careers Center</Breadcrumb.Item>
                                    }
                                </Breadcrumb>
                            </div>
                        </HeaderNav>
                        <div style={{ padding: '14px 16px 0', marginBlockStart: '130px' }}>
                            <Content
                                className="responsive-content"
                                style={{
                                    margin: '0 auto',
                                    marginBlockStart: '50px',
                                    zIndex: -1,
                                    padding: '30px',
                                    minWidth: 'fit-content',
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
            </Layout >
        </>
    )
});

export default FullLayout;
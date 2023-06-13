
import { Breadcrumb, Layout } from 'antd';
import HeaderNav from './Header';
import SideNav from './SideNav';
import userStore from '../stores/userStore';
import React, { useState, ReactNode } from 'react';
import appConfig from '../stores/appStore';
import { observer } from 'mobx-react';
import ErrorDataModal from './modals/ErrorDataModal';

const { Content, Footer } = Layout;

const FullLayout: React.FC<{ children: ReactNode }> = (props) => {
    const [marginResponsive, setMarginResponsive] = useState(200)

    const setPath = (pathname: string | null) => {
        document.title = process.env.REACT_APP_WINDOW_TITLE || '';
        if (pathname) {
            const splitStr = pathname.split('-');
            const words = splitStr.map((word) => {
                const firstLetter = word.charAt(0).toUpperCase();
                const restOfWord = word.slice(1).toLowerCase();
                return firstLetter + restOfWord;
            });
            document.title = process.env.REACT_APP_WINDOW_TITLE + " - " + words.join(' ');
            return words.join(' ');
        }
    };

    return (
        <>
            <Layout hasSider>
                <Layout>
                    <SideNav state={marginResponsive} stateFunc={setMarginResponsive} />
                    <Layout className="site-layout" style={{ marginLeft: (marginResponsive) }} >
                        <HeaderNav marginResponsive={marginResponsive}>
                            <div style={{ position: 'fixed', marginLeft: '20px', left: marginResponsive, marginTop: '60px', color: 'black' }}>
                                <Breadcrumb style={{ margin: '16px 0px', position: 'fixed' }}>
                                    {userStore.userInfo && appConfig.currPage
                                        ?
                                        <>
                                            <Breadcrumb.Item>Careers Center</Breadcrumb.Item>
                                            <Breadcrumb.Item>{setPath(appConfig.currPage)}</Breadcrumb.Item>
                                        </>
                                        : <Breadcrumb.Item >Careers Center</Breadcrumb.Item>
                                    }
                                </Breadcrumb>
                            </div>
                        </HeaderNav>
                        <div style={{ padding: '14px 16px 0', marginBlockStart: '130px' }}>
                            <Content
                                className="responsive-content"
                                style={{
                                    background: 'white',
                                    margin: '0 auto',
                                    marginBlockStart: '50px',
                                    position: 'relative',
                                    zIndex: 0,
                                    padding: '30px',
                                    minWidth: 'fit-content',
                                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
                                }}
                            >
                                {!appConfig.errorModalVisible ? props.children : <ErrorDataModal />}
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
};

export default observer(FullLayout);
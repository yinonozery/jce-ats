import {
    Form,
    Input,
    Divider,
    List,
    Button,
    message,
} from 'antd';
import { useState, useRef } from 'react';
import { CloseCircleOutlined, FileSearchOutlined } from '@ant-design/icons';
import { MISSING_KEYWORDS, MISSING_COURSE_NAME, FIELD_MIN_LENGTH, DUPLICATE_KEYWORD } from '../utils/messages';
import AppConfig from '../stores/appStore';
import type { FormInstance } from 'antd/es/form';

const AddCourse: React.FC = () => {
    const [form] = Form.useForm();
    const [keywords, setKeywords] = useState<string[]>([]);
    const formRef = useRef<FormInstance>(null);
    const pageSize = 5;

    type UploadForm = {
        course_name: string,
        keywords: string[],
    }

    const onFinish = async (values: any) => {
        AppConfig.loadingHandler(true);

        const uploadForm: UploadForm = {
            course_name: values.course_name,
            keywords: keywords,
        }
        
        try {
            if (keywords.length < 3) {
                message.error(MISSING_KEYWORDS(3 - keywords.length))
                return;
            }

            // API Request AWS Form
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/courses`, {
                method: 'POST',
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadForm),
            });
            console.log(response.json());

        } catch (error) {
            console.error(error)
        } finally {
            AppConfig.loadingHandler(false);
        }

        // AppConfig.loadingHandler(false);
    };


    const addKeyword = () => {
        const word = formRef.current?.getFieldValue('keyword');
        if (word.length < 2) message.error(FIELD_MIN_LENGTH("Keyword", 2))
        else if (keywords.includes(word)) message.error(DUPLICATE_KEYWORD(word))
        else {
            setKeywords([...keywords, formRef.current?.getFieldValue('keyword')]);
            formRef.current?.setFieldValue('keyword', '');
        }
    }

    const addKeywordsHTML =
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center' }}>
            <FileSearchOutlined style={{ fontSize: '30px', color: '#ce181e' }} />
            <Form.Item style={{ margin: 'auto' }} name="keyword" htmlFor='keyword' normalize={(value) => value.trim()}>
                <Input id='keyword' maxLength={20} placeholder="Enter keyword" style={{ width: 'max(120px, 100%)' }} />
            </Form.Item>
            <Button type="default" onClick={addKeyword}>Add Keyword</Button>
        </div>
    return (
        <>
            <Divider orientation='center'>Add a new course</Divider>
            <Form
                form={form}
                autoComplete="true"
                name="control-hooks"
                layout="horizontal"
                ref={formRef}
                onFinish={onFinish}
                onReset={() => setKeywords([])}
            >
                {/* Course Name */}
                <Form.Item style={{ minWidth: '48%' }} name="course_name" label="Course Name" htmlFor='coursename' rules={[
                    {
                        type: 'string',
                        required: true,
                        message: MISSING_COURSE_NAME,
                    }, {
                        min: 3,
                        message: FIELD_MIN_LENGTH("Name", 3),
                    }]} hasFeedback>
                    <Input id='coursename' />
                </Form.Item>

                {/* Keywords */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px', minWidth: '350px' }}>

                    <List
                        bordered={true}
                        size={'small'}
                        header={addKeywordsHTML}
                        pagination={{
                            pageSize: pageSize,
                            showQuickJumper: false,
                            hideOnSinglePage: true,
                            position: 'bottom',
                        }}
                        style={{ width: 'min-content', minHeight: '310px' }}
                        dataSource={keywords}
                        renderItem={(item) => (
                            <List.Item>
                                # {item}
                                <span style={{ 'float': 'right', marginLeft: '10px' }} onClick={() => setKeywords(keywords.filter((word, _) => word !== item))}><CloseCircleOutlined /></span>
                            </List.Item>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <Form.Item style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button type="default" htmlType="reset" style={{ marginBottom: '10px' }}>Reset</Button>
                    <Button type="primary" htmlType="submit" block>Submit</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AddCourse;
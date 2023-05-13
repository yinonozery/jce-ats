import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, message, Divider, Button, List, FormInstance, Radio } from 'antd';
import { MISSING_FIELD, FIELD_MIN_LENGTH, DUPLICATE_KEYWORD, ADD_SUCCESS } from '../../utils/messages';
import Course from '../types/Course';
import { FileSearchOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface modalProps {
    mode: 'Add' | 'Edit';
    course: Course | undefined;
    weightsLevels: Map<number, string>
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}


const CourseModal: React.FC<modalProps> = (props: modalProps) => {
    const [form] = Form.useForm();
    const [addLoading, setAddLoading] = useState(false);
    const [keywords, setKeywords] = useState<Map<string, number>>(new Map());
    const [keywordsKeysArr, setKeywordsKeysArr] = useState<string[] | any>([]);
    const formRef = useRef<FormInstance>(null);
    const pageSize = 5;

    useEffect(() => {
        setKeywordsKeysArr([]);
        form.setFieldsValue({
            name: props?.course?.name || '',
        });

        const newMap = new Map(props.course?.keywords)
        setKeywords(newMap)

        //@ts-ignore
        setKeywordsKeysArr(props.course?.keywords?.map(([x, y]) => x));

    }, [form, props.mode, props.course?.keywords, props.course?.name])


    const onFinish = async () => {
        const values = await form.validateFields(['name']);

        if (!values.name || !keywords)
            return;
        setAddLoading(false);

        const newCourseForm: { name: string | undefined, keywords: Map<string, number> | undefined | null | [string, number][], mode: 'Add' | 'Edit' } = {
            name: values.name,
            keywords: Array.from(keywords.entries()),
            mode: props.mode,
        };

        try {
            // API Request AWS Form
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourseForm),
            });
            const data: any = await response.json();
            if (data.statusCode === 200)
                message.success(ADD_SUCCESS("Course"));
            else
                throw data.error;
            form.resetFields();
            props.stateFunc(false);
        } catch (error: any) {
            message.error(error);
        } finally {
            setAddLoading(false);
            setKeywordsKeysArr([]);
        }
    };


    const addKeyword = () => {
        const word = formRef.current?.getFieldValue('keyword').toLowerCase();
        const weight = formRef.current?.getFieldValue('weight');
        if (!word) {
            message.error(MISSING_FIELD("keyword"));
            return;
        }
        if (word.length < 2) message.error(FIELD_MIN_LENGTH("keyword", 2))
        else if (keywords?.get(word)) message.error(DUPLICATE_KEYWORD(word))
        else {
            keywords.set(word, weight);
            setKeywords(new Map(keywords));
            keywordsKeysArr && keywordsKeysArr.length > 0 ? setKeywordsKeysArr([...keywordsKeysArr, word]) : setKeywordsKeysArr([word])
            formRef.current?.setFieldValue('keyword', '');
        }
    }

    const addKeywordsHTML =
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                {/* <span style={{ display: 'flex', alignItems: 'center' }}>
                <Divider>Keywords</Divider>
                <FileSearchOutlined style={{ fontSize: '25px', color: '#ce181e' }} />
                <span style={{ marginLeft: '10px' }}>Keywords</span>
            </span> */}
                <Form.Item style={{ marginBlock: 'auto' }} label="Keyword" name="keyword" htmlFor='keyword' normalize={(value) => value.trim()}>
                    <Input id='keyword' maxLength={20} placeholder="Enter keyword" style={{ width: 'max(120px, 100%)' }} />
                </Form.Item>
                <Form.Item
                    name="weight"
                    label="Weight"
                    style={{ marginBlock: 'auto' }}
                    tooltip={
                        <p>
                            <u>Low:</u> Optional, desirable<br />
                            <u>Moderate:</u> Preferable, adds value<br />
                            <u>High:</u> Important, should be present<br />
                            <u>Max:</u> Essential, must be included
                        </p>
                    }
                >
                    <Radio.Group optionType="button" buttonStyle="solid" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                        <Radio.Button value="0.25">Low</Radio.Button>
                        <Radio.Button value="0.5" >Moderate</Radio.Button>
                        <Radio.Button value="0.75" >High</Radio.Button>
                        <Radio.Button value="1">Max</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={addKeyword} style={{ margin: '15px auto' }}>
                    <PlusCircleOutlined />Add Keyword<PlusCircleOutlined />
                </Button>
            </div>
        </>

    return (
        <Modal
            title={<Divider orientation='left'>{props.mode === 'Add' ? 'Add a new course' : 'Edit course'}</Divider>}
            open={props.state}
            onCancel={() => { props.stateFunc(false); setKeywords(new Map()) }}
            footer={null}
            forceRender
        >
            <Form
                form={form}
                ref={formRef}
                layout='vertical'
                onSubmitCapture={onFinish}
                initialValues={props?.course}
            >
                {/* Name */}
                <Form.Item label='Course Name' name='name' rules={[{
                    required: true,
                    message: MISSING_FIELD('Name')
                }]}>
                    <Input />
                </Form.Item>

                {/* Keywords */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px', minWidth: '350px', marginBlockEnd: '20px' }}>
                    <FileSearchOutlined style={{ fontSize: '30px', color: 'red' }} />
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
                        style={{ width: '100%' }}
                        dataSource={keywordsKeysArr}
                        renderItem={(item: string) => {
                            return (
                                <List.Item>
                                    # {item} - {props.weightsLevels.get(Number(keywords.get(item)))}
                                    <span style={{ 'float': 'right', marginLeft: '10px' }} onClick={() => { keywords.delete(item); setKeywordsKeysArr(keywordsKeysArr.filter((word: string) => word !== item)) }}><CloseCircleOutlined /></span>
                                </List.Item>
                            )
                        }}
                    />
                </div>

                {/* Submit Button */}
                <Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button type='dashed' htmlType='reset' loading={addLoading} style={{ marginBottom: '10px' }} onClick={() => { setKeywordsKeysArr([]); setKeywords(new Map()) }}>Reset</Button>
                    </div>
                    <Button block type='primary' htmlType='submit' loading={addLoading}>{props.mode === 'Add' ? 'Add' : 'Save'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default CourseModal;
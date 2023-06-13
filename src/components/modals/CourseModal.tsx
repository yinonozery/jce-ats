import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, message, Divider, Button, List, FormInstance, Radio, Tag } from 'antd';
import { MISSING_FIELD, FIELD_MIN_LENGTH, DUPLICATE_KEYWORD, ADD_SUCCESS, UPDATE_SUCCESS } from '../../utils/messages';
import { FileSearchOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Keyword from '../types/Keyword';
import Course from '../types/Course';
import dataStore from '../../stores/dataStore';

interface modalProps {
    mode: 'Add' | 'Edit';
    course: Course | undefined;
    weightLevels: Record<number, { level: string, color: string, backgroundColor: string }>,
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

const CourseModal: React.FC<modalProps> = (props: modalProps) => {
    const [form] = Form.useForm();
    const [addLoading, setAddLoading] = useState(false);
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const formRef = useRef<FormInstance>(null);
    const pageSize = 5;

    useEffect(() => {
        form.setFieldsValue({
            name: props?.course?.name || '',
        });
        setKeywords(props?.course?.keywords || [])

    }, [form, props.mode, props.course?.keywords, props.course?.name, props.state])

    const onFinish = async () => {
        const values = await form.validateFields(['name']);

        if (!values.name || !keywords)
            return;

        setAddLoading(false);

        const newCourseForm = {
            name: values.name,
            keywords: keywords,
            mode: props.mode,
        };

        try {
            // API Request AWS Form
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourseForm),
            });
            const data: any = await response.json();
            if (data.statusCode === 200) {
                if (props.mode === 'Add')
                    message.success(ADD_SUCCESS("Course"));
                else if (props.mode === 'Edit')
                    message.success(UPDATE_SUCCESS("Course"))
                dataStore.fetchCoursesData(true);
            } else {
                throw data.error;
            }
            handleReset(false);
        } catch (error: any) {
            message.error(error);
        } finally {
            setAddLoading(false);
        }
    };

    const addKeyword = () => {
        const word = formRef.current?.getFieldValue('keyword')?.toLowerCase();
        const weight = formRef.current?.getFieldValue('weight');
        let synonyms = formRef.current?.getFieldValue('synonyms');
        synonyms = synonyms ? synonyms.split(',').map((word: string) => word.trim()) : null // Split string into string[] & Trim all synonyms

        const uniqueSet = new Set(synonyms) // Set for duplicated synonyms check
        if (!word || !weight) {
            message.error(MISSING_FIELD(!word ? "keyword" : "weight"));
            return
        }
        if (word.length < 1)
            message.error(FIELD_MIN_LENGTH("keyword", 1)) // Minimum length of keyword
        else if (keywords?.some((keyObj) => keyObj.keyword.toLowerCase() === word)) // Duplicated keyword
            message.error(DUPLICATE_KEYWORD(word))
        else if (synonyms && synonyms.length !== uniqueSet.size)
            message.error('Duplicated synonyms')
        else {
            const keywordObj: Keyword = {
                keyword: word,
                weight: weight,
                synonyms: synonyms,
            }
            setKeywords(keywords => [...keywords, keywordObj]);
            form.resetFields(['keyword', 'weight', 'synonyms'])
        }
    }

    const addKeywordsHTML =
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>

                {/* Keyword */}
                <Form.Item style={{ marginBlock: 'auto' }} label="Keyword" name="keyword" htmlFor='keyword' normalize={(value) => value.trim()} required>
                    <Input id='keyword' maxLength={20} placeholder="Enter keyword" style={{ width: 'max(120px, 100%)' }} />
                </Form.Item>

                {/* Weight */}
                <Form.Item name="weight" label="Weight" style={{ marginBlock: 'auto' }} tooltip={
                    <p>
                        <u>Low:</u> Optional, desirable<br />
                        <u>Moderate:</u> Preferable, adds value<br />
                        <u>High:</u> Important, should be present<br />
                        <u>Max:</u> Essential, must be included
                    </p>
                } required>
                    <Radio.Group optionType="button" buttonStyle="solid" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                        <Radio.Button value="0.25">Low</Radio.Button>
                        <Radio.Button value="0.5" >Moderate</Radio.Button>
                        <Radio.Button value="0.75" >High</Radio.Button>
                        <Radio.Button value="1">Max</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {/* Synonyms */}
                <Form.Item name="synonyms" label="Synonyms" style={{ marginBlock: 'auto' }} tooltip={<>For better match accuracy, enter synonyms for this keyword, separating each with a comma</>}>
                    <Input id='synonyms' placeholder="Enter synonyms" />
                </Form.Item>
            </div>

            {/* Button */}
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={addKeyword} style={{ margin: '15px auto' }}>
                    <PlusCircleOutlined />&nbsp;Add Keyword
                </Button>
            </div>
        </>

    const handleDeleteTag = (_keyword: string | undefined, _synonym: string) => {
        setKeywords((prevKeywords) => {
            // Find the keyword object with matching keyword value
            const keywordIndex = prevKeywords.findIndex((keyword) => keyword.keyword === _keyword);

            if (keywordIndex !== -1) {
                // Filter the synonyms array and remove the specified synonym
                const updatedSynonyms = prevKeywords[keywordIndex].synonyms.filter((synonym) => synonym !== _synonym);

                // Create a new array with the updated synonyms for the keyword
                const updatedKeywords = [...prevKeywords];
                updatedKeywords[keywordIndex] = { ...updatedKeywords[keywordIndex], synonyms: updatedSynonyms };

                return updatedKeywords;
            }
            return prevKeywords; // Return the previous state if the keyword is not found
        });
    };

    const handleReset = (closeModal: boolean) => {
        props.stateFunc(closeModal);
        setKeywords([]);
        form.resetFields()
    }

    return (
        <Modal
            title={<Divider orientation='left'>{props.mode === 'Add' ? 'Add a new course' : 'Edit course'}</Divider>}
            open={props.state}
            onCancel={() => handleReset(false)}
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
                        dataSource={keywords}
                        renderItem={(item: Keyword) => {
                            return (
                                <List.Item>
                                    # {item.keyword} - {props.weightLevels[Number(keywords.find((keyObj) => keyObj.keyword === item.keyword)?.weight)].level}
                                    <span style={{ marginLeft: '10px' }}>
                                        {keywords.find((keyObj) => keyObj.keyword === item.keyword)?.synonyms?.map((synonym, index) => {
                                            const uniqueKey = `${item.keyword}-${synonym}-${index}`;
                                            return (
                                                <Tag key={uniqueKey} onClose={() => handleDeleteTag(item.keyword, synonym)} closable>
                                                    {synonym}
                                                </Tag>
                                            )
                                        })}
                                    </span>
                                    <span style={{ 'float': 'right', marginLeft: '10px' }} onClick={() => { setKeywords(keywords.filter((keyObj) => keyObj.keyword !== item.keyword)) }}>
                                        <CloseCircleOutlined />
                                    </span>
                                </List.Item>
                            );

                        }}
                    />
                </div>

                {/* Submit Button */}
                <Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button type='dashed' htmlType='reset' loading={addLoading} style={{ marginBottom: '10px' }} onClick={() => { handleReset(true) }}>Reset</Button>
                    </div>
                    <Button block type='primary' htmlType='submit' loading={addLoading}>{props.mode === 'Add' ? 'Add' : 'Save'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default CourseModal;
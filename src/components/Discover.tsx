import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, Collapse, Checkbox, Select, Row, InputNumber, Form, message } from 'antd';
import { ThunderboltTwoTone, UpCircleFilled, WomanOutlined, ManOutlined } from '@ant-design/icons';
import { MISSING_FIELD } from '../utils/messages';
import ResultsModal from './modals/ResultsModal';
import RelevantCandidate from './types/RelevantCandidate';
import Course from './types/Course';
import Keyword from './types/Keyword';
import DataStore from '../stores/dataStore';

const Discover: React.FC = () => {
    const [coursesOptions, setCoursesOptions] = useState<any>();
    const [selectedCourse, setSelectedCourse] = useState<Course>();
    const [filteredCandidates, setFilteredCandidates] = useState<RelevantCandidate[]>([]);
    const [resultsModal, setResultsModal] = useState<boolean>(false);
    const [minExpDisabled, setMinExpDisabled] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { Panel } = Collapse;

    useEffect(() => {
        DataStore.fetchKeywordsData(false);
        DataStore.fetchCoursesData(false).then(() => {
            setCoursesOptions(DataStore.coursesData?.map((course: Course) => ({
                label: course.name,
                value: course.name,
                data: course,
            })))
        }
        );
    }, []);

    const searchForCandidate = (values: any) => {
        if (DataStore?.candidatesData && DataStore?.candidatesData?.length <= 0) {
            message.error("No Candidates")
            return;
        }

        const relevantsCandidates = [];
        for (const candidate of DataStore.candidatesData || []) {
            if (
                (values.min_years_of_exp && candidate?.work_experience < values.min_years_of_exp) ||
                (values.degree !== 'All' && candidate?.degree !== values.degree && values.degree !== 'Any') ||
                (values.gender !== 'All' && candidate?.gender !== values.gender && values.gender !== 'Any')
            )
                continue;

            const relevantCandidate: RelevantCandidate = {
                candidate: undefined,
                keywordsMatches: [],
                score: 0,
            };

            const keywordArr = Object.keys(candidate.keywords);
            // console.log(`%c${candidate.first_name} ${candidate.last_name}`, 'font-weight:bold; color: red');
            if (selectedCourse) {
                selectedCourse.keywords.forEach((keywordObj: Keyword) => {
                    const keyword = keywordObj.keyword.toLowerCase();
                    const isKeywordMatch = keywordArr.includes(keyword) || keywordObj?.synonyms?.some((synonym: string) => keywordArr.includes(synonym.toLowerCase()));
                    if (isKeywordMatch) {
                        relevantCandidate.candidate = candidate;
                        // console.log('\t', `${keywordObj.keyword} (${keywordObj.weight})`);

                        // TF(t,d)
                        //@ts-ignore
                        const TF = candidate.keywords[keyword] || 1;

                        // IDF(t)
                        const numerator = 1 + (DataStore.keywordsData?.numOfResumes || 0);
                        const denominator = 1 + (DataStore.keywordsData?.currentDocStats[keywordObj.keyword] || 0);
                        const IDF = Math.log(numerator / denominator)

                        relevantCandidate.score += (TF * IDF * keywordObj.weight);
                        relevantCandidate.keywordsMatches.push(keywordObj.keyword);
                    }
                });
            }

            relevantCandidate.score = Number(relevantCandidate.score.toPrecision(5));
            // console.log(`\t%c Score: ${relevantCandidate.score}`, 'font-weight:bold; color: blue');

            if (relevantCandidate.score > 0) {
                relevantsCandidates.push(relevantCandidate);
            }
        }
        relevantsCandidates.sort((a, b) => b.score - a.score);
        setFilteredCandidates(relevantsCandidates);
        setResultsModal(true);
    };

    return (
        <>
            <ResultsModal state={resultsModal} stateFunc={setResultsModal} data={filteredCandidates} />
            <Collapse bordered={false} expandIcon={({ isActive }) => <UpCircleFilled style={{ fontSize: '16px' }} rotate={isActive ? 180 : 90} />} >
                <Panel header={<span style={{ fontWeight: 'bold' }}>
                    Discover Relevant Candidates
                </span>} key='0' extra={<ThunderboltTwoTone />}>
                    <Form
                        form={form}
                        initialValues={{ min_years_of_exp: 0, gender: 'Any', degree: 'Any' }}
                        onResetCapture={() => { setFilteredCandidates([]); setSelectedCourse(undefined); setMinExpDisabled(false) }}
                        onFinish={searchForCandidate}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>

                                {/* Min Years of Exp */}
                                <Form.Item name='min_years_of_exp' label='Minimum Years of Experience' htmlFor='min_years_of_exp'>
                                    <InputNumber
                                        min={0}
                                        max={99}
                                        style={{ width: '60px', marginRight: '15px' }}
                                        disabled={minExpDisabled}
                                    />
                                </Form.Item>

                                {/* Checkbox */}
                                <Form.Item name='checkbox_zero' label='No Experience Required' valuePropName='checked' colon={false}>
                                    <Checkbox onClick={() => { setMinExpDisabled(!minExpDisabled); form.setFieldsValue({ 'min_years_of_exp': 0 }) }} />
                                </Form.Item>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                {/* Gender */}
                                <Form.Item name='gender' label='Gender' style={{ width: 'fit-content' }}>
                                    <Select
                                        style={{ width: 120 }}
                                        options={[
                                            { value: 'Any', label: 'Any' },
                                            { value: 'Male', label: <span>Male <ManOutlined /></span> },
                                            { value: 'Female', label: <span>Female <WomanOutlined /></span> },
                                        ]}
                                    />
                                </Form.Item>

                                {/* Degree */}
                                <Form.Item name='degree' label='Degree'>
                                    <Select
                                        style={{ width: '110px' }}
                                        options={[
                                            { value: 'Any', label: 'Any' },
                                            { value: 'Associate', label: 'Associate' },
                                            { value: 'Bachelor', label: 'Bachelor' },
                                            { value: 'Master', label: 'Master' },
                                            { value: 'Doctor', label: 'Doctor' },
                                        ]}
                                    />
                                </Form.Item>
                            </div>

                            {/* Select Course */}
                            <Form.Item name='course' label='Course' htmlFor='course' rules={[{
                                required: true,
                                message: MISSING_FIELD('course name')
                            }]}>
                                <Select
                                    options={coursesOptions}
                                    onSelect={(_, select: any) => setSelectedCourse(select.data)}
                                    onClear={() => setSelectedCourse(undefined)}
                                    style={{ width: '250px' }}
                                    allowClear
                                />
                            </Form.Item>
                        </div>

                        {/* Buttons */}
                        <Form.Item>
                            <Row justify='space-around'>
                                <Button shape='round' type='default' htmlType='reset'>Reset</Button>
                                <Button shape='round' type='primary' htmlType='submit'>Search For Candidate</Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        </>
    )
}
export default observer(Discover);
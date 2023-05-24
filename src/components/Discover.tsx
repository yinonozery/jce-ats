import React, { useState, useEffect } from 'react';
import { Button, Collapse, Checkbox, Select, Row, InputNumber, Form, message } from 'antd';
import { ThunderboltOutlined, UpCircleOutlined } from '@ant-design/icons';
import { FETCHING_DATA_FAILED, MISSING_FIELD } from '../utils/messages';
import ResultsModal from './modals/ResultsModal';
import RelevantCandidate from './types/RelevantCandidate';
import AppConfig from '../stores/appStore';
import Course from './types/Course';
import Keywords from './types/Keywords';
import Keyword from './types/Keyword';
import Candidate from './types/Candidate';

const Discover: React.FC<{ candidates: Candidate[] }> = (props) => {
    const [courses, setCourses] = useState<Course[]>();
    const [allKeywords, setAllKeywords] = useState<Keywords>();
    const [selectedCourse, setSelectedCourse] = useState<Course>();
    const [filteredCandidates, setFilteredCandidates] = useState<RelevantCandidate[]>([]);
    const [resultsModal, setResultsModal] = useState<boolean>(false);
    const [minExpDisabled, setMinExpDisabled] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { Panel } = Collapse;

    const url_courses = `${process.env.REACT_APP_BASE_URL}/jce/courses`;
    const url_keywords = `${process.env.REACT_APP_BASE_URL}/jce/keywords`;

    useEffect(() => {
        setCourses([]);
        AppConfig.loadingHandler(true);

        const fetchCourses = () => {
            fetch(url_courses)
                .then((res) => res.json())
                .then((data) => {
                    if (data.statusCode === 500) {
                        message.error('Courses ' + FETCHING_DATA_FAILED);
                        return;
                    }

                    const courseSelects = data.body.map((course: Course) => ({
                        label: course.name,
                        value: course.name,
                        data: course,
                    }));

                    setCourses((courses: any) => [...courses, ...courseSelects]);
                })
                .catch(() => {
                    message.error('Failed to fetch courses');
                });
        };

        const fetchKeywords = () => {
            fetch(url_keywords)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.currentKeywords) {
                        message.error('Keywords ' + FETCHING_DATA_FAILED);
                        return;
                    }

                    setAllKeywords({
                        currentKeywords: data.currentKeywords,
                        numOfResumes: data.numOfResumes,
                        currentDocStats: data.currentDocStats,
                    });
                })
                .catch(() => {
                    message.error('Failed to fetch keywords');
                })
                .finally(() => {
                    AppConfig.loadingHandler(false);
                });
        };

        Promise.all([fetchCourses(), fetchKeywords()]);
    }, [url_courses, url_keywords]);

    const searchForCandidate = (values: any) => {
        const relevantsCandidates = [];
        for (const candidate of props.candidates) {
            const relevantCandidate: RelevantCandidate = {
                candidate: undefined,
                keywordsMatches: [],
                score: 0,
            };
            const keywordArr = Object.keys(candidate.keywords);
            console.log(`%c${candidate.first_name} ${candidate.last_name}`, 'font-weight:bold; color: red');
            if (candidate?.work_experience >= values.min_years_of_exp) {
                if (selectedCourse) {
                    selectedCourse.keywords.forEach((keywordObj: Keyword) => {
                        const keyword = keywordObj.keyword.toLowerCase();
                        const isKeywordMatch = keywordArr.includes(keyword) || keywordObj?.synonyms?.some((synonym: string) => keywordArr.includes(synonym.toLowerCase()));
                        if (isKeywordMatch) {
                            relevantCandidate.candidate = candidate;
                            console.log('\t', `${keywordObj.keyword} (${keywordObj.weight})`);

                            // TF(t,d)
                            const TF = candidate.keywords[keyword] || 1;

                            // IDF(t)
                            const numerator = 1 + (allKeywords?.numOfResumes || 0);
                            const denominator = 1 + (allKeywords?.currentDocStats[keywordObj.keyword] || 0);
                            const IDF = Math.log(numerator / denominator)

                            // relevantCandidate.score += (TF * IDF !== 0 ? IDF : 1 * keywordObj.weight); Old formula
                            relevantCandidate.score += (TF * IDF * keywordObj.weight);
                            relevantCandidate.keywordsMatches.push(keywordObj.keyword);
                        }
                    });
                }
            }
            relevantCandidate.score = Number(relevantCandidate.score.toPrecision(5));
            console.log(`\t%c Score: ${relevantCandidate.score}`, 'font-weight:bold; color: blue');

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
            <Collapse bordered={false} expandIcon={({ isActive }) => <UpCircleOutlined style={{ fontSize: '16px' }} rotate={isActive ? 180 : 0} />} >
                <Panel header={<span style={{ fontWeight: 'bold' }}>
                    Discover Relevant Candidates
                </span>} key='0' extra={<ThunderboltOutlined />}>
                    <Form form={form} initialValues={{ 'min_years_of_exp': 0 }}
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

                            {/* Select Course */}
                            <Form.Item name='course' label='Course' htmlFor='course' rules={[{
                                required: true,
                                message: MISSING_FIELD('course name')
                            }]}>
                                <Select
                                    options={courses}
                                    onSelect={(_, select: any) => setSelectedCourse(select.data)}
                                    onClear={() => setSelectedCourse(undefined)}
                                    style={{ width: '250px' }}
                                    allowClear
                                />
                            </Form.Item>
                        </div>

                        {/* Buttons */}
                        <Form.Item>
                            <Row justify={'space-around'}>
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
export default Discover;
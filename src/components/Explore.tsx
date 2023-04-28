import React, { useState, useEffect } from 'react';
import { Card, Divider, Select, Space, Tag, message, Typography } from 'antd';
import { FETCHING_DATA_FAILED } from '../utils/messages';
import AppConfig from '../stores/appStore';
import type Candidate from './types/Candidate';
import type Course from './types/Course';
const { Text } = Typography;

interface SelectOption<T> {
    label: string;
    value: string;
    data: T;
};

const Explore: React.FC = () => {
    const [candidates, setCandidates] = useState<SelectOption<Candidate>[]>([]);
    const [courses, setCourses] = useState<SelectOption<Course>[]>();
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();
    const [selectedCourse, setSelectedCourse] = useState<Course>();

    const url_candidates = `${process.env.REACT_APP_BASE_URL}/jce/candidates`;
    const url_courses = `${process.env.REACT_APP_BASE_URL}/jce/courses`;

    useEffect(() => {
        setCandidates([]);
        setCourses([]);

        AppConfig.loadingHandler(true);
        fetch(url_candidates)
            .then((res) => res.json()
                .then((data) => {
                    if (!data.data)
                        message.error(FETCHING_DATA_FAILED)
                    data.data.forEach((candidate: Candidate) => {
                        const candidateSelect = {
                            label: candidate.first_name + candidate.last_name,
                            value: candidate.first_name + candidate.last_name,
                            data: candidate,
                        }
                        setCandidates((candidates: any) => [...candidates, candidateSelect])
                    })
                }).finally(() =>
                    fetch(url_courses)
                        .then((res) => res.json()
                            .then((data) => {
                                if (!data.data)
                                    message.error(FETCHING_DATA_FAILED)
                                data.data.forEach((course: Course) => {
                                    const courseSelect = {
                                        label: course.name,
                                        value: course.name,
                                        data: course,
                                    }
                                    setCourses((courses: any) => [...courses, courseSelect])
                                })
                            }).finally(() => AppConfig.loadingHandler(false))
                        )
                ));
    }, [url_courses, url_candidates])


    return (
        <>
            <Divider>Find a match</Divider>
            <div style={{ display: 'flex', gap: 10 }}>
                <Select
                    showSearch
                    placeholder='Select a candidate'
                    onSelect={(_, select2) => setSelectedCandidate(select2.data)}
                    onClear={() => setSelectedCandidate(undefined)}
                    options={candidates}
                    size='large'
                    style={{ width: '100%' }}
                    allowClear
                />
                <Select
                    showSearch
                    placeholder='Select a course'
                    onSelect={(_, select2: any) => setSelectedCourse(select2.data)}
                    onClear={() => setSelectedCourse(undefined)}
                    options={courses}
                    size='large'
                    style={{ width: '100%' }}
                    allowClear
                />
            </div>
            {selectedCandidate && selectedCourse ?
                <div style={{ display: 'flex' }}>
                    <Card title={selectedCandidate?.first_name + selectedCandidate?.last_name} style={{ margin: '10px auto', width: 'fit-content' }}>
                        <p><Text strong type='danger'>Gender: </Text>{selectedCandidate?.gender}</p>
                        <p><Text strong type='danger'>Keywords: </Text>{selectedCandidate?.keywords.length} Words</p>
                    </Card>
                    <Card title={selectedCourse?.name} style={{ margin: '10px auto', width: 'fit-content' }}>
                        <p><Text strong type='danger'>Keywords: </Text>{selectedCourse?.keywords.length} Words</p>
                    </Card>
                </div>
                : ''}
            <Divider>Matching Results</Divider>
            <Space>
                {selectedCourse?.keywords.filter((courseKeyword: string) => {
                    return selectedCandidate?.keywords.includes(courseKeyword.toLowerCase());
                }).map((matchedKeyword: string) => {
                    return <Tag key={matchedKeyword} color='blue-inverse' >{matchedKeyword.charAt(0).toUpperCase() + matchedKeyword.substring(1,)}</Tag>;
                })}
            </Space>
        </>
    )
};

export default Explore;
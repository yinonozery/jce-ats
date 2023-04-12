import React, { useState, useEffect } from 'react';
import { Divider, Select, message } from 'antd';
import { FETCHING_DATA_FAILED } from '../utils/messages';
import AppConfig from '../stores/appStore';
import type Candidate from './types/Candidate';
import type Course from './types/Course';

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
            {selectedCandidate ?
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span><b><u>First Name:</u></b> {selectedCandidate?.first_name}</span>
                    <span><b><u>Last Name:</u></b> {selectedCandidate?.last_name}</span>
                    <span><b><u>Role:</u></b> {selectedCandidate?.role}</span>
                    <span><b><u>Keywords:</u></b> {selectedCandidate?.keywords.length} Words</span>
                </div>
                : ''}
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
            {selectedCourse ?
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span><b><u>Name:</u></b> {selectedCourse?.name}</span>
                    <span><b><u>Keywords:</u></b> {selectedCourse?.keywords.length} Words</span>
                </div>
                : ''}
            <Divider>Matching Results</Divider>
        </>
    )
};

export default Explore;
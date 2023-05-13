import { Divider, message, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { FETCHING_DATA_FAILED } from "../utils/messages";
import Course from "./types/Course";

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const url = `${process.env.REACT_APP_BASE_URL}/jce/courses`;

    useEffect(() => {
        fetch(url)
            .then((res) => res.json()
                .then((data) => {
                    if (!data.data)
                        message.error(FETCHING_DATA_FAILED)
                    setCourses(data.data);
                }).finally(() => setIsLoading(false)));
    }, [url])

    const columns = [
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Keywords',
            key: 'keywords',
            dataIndex: 'keywords',
            render: (record: any) => <> {
                record.map((tag: string, index: number) => {
                    return <Tag key={index} style={{ marginBlock: '5px' }}>{tag}</Tag>
                })}</>,
        }
    ];

    return (
        <>
            <Divider orientation="left">Courses List</Divider>
            <Table
                dataSource={courses}
                columns={columns}
                size="middle"
                loading={isLoading}
                bordered
            />
        </>
    )
}

export default Courses;
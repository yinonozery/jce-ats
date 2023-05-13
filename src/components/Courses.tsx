import { Divider, message, Table, Dropdown, Button, Modal, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { DELETE_SUCCESS, DELETE_SURE, FETCHING_DATA_FAILED } from '../utils/messages';
import { EllipsisOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import type { MenuProps } from 'antd';
import CourseModal from './Modals/CourseModal';
import Course from './types/Course';


const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [openTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'Add' | 'Edit'>('Add');
    const [actionID, setActionID] = useState<{ courseName: string }>();
    const weightsLevels = new Map(
        [[0.25, 'Low'],
        [0.5, 'Moderate'],
        [0.75, 'High'],
        [1, 'Max']
        ]);

    let url = `${process.env.REACT_APP_BASE_URL}/jce/courses`;

    useEffect(() => {
        if (!openTemplateModal)
            fetch(url)
                .then((res) => res.json()
                    .then((data) => {
                        if (!data.data)
                            message.error(FETCHING_DATA_FAILED)
                        setCourses(data.data);
                    }).finally(() => setIsLoading(false)));
    }, [openTemplateModal, url])

    const deleteTemplate = () => {
        fetch(`${url}?name=${actionID?.courseName}`, {
            method: 'DELETE',
        })
            .then(response => response.json().then((data) => {
                if (data.statusCode === 200) {
                    message.success(DELETE_SUCCESS("Course"));
                    setCourses(courses.filter((course) => course.name !== actionID?.courseName));
                } else {
                    message.error(data?.error);
                }
                setDeleteModal(false);
            }))
    }


    const items: MenuProps['items'] = [
        {
            label: <span onClick={() => {
                setSelectedCourse(courses.find((course) => course.name === actionID?.courseName))
                setModalMode('Edit');
                setEditTemplateModal(true);
            }}>Edit</span>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => setDeleteModal(true)}>Delete</span>,
            key: '3',
            danger: true,
        },
    ];

    const dropdown = (courseName: string) => {
        return (
            <Dropdown menu={{ items }} trigger={['click']} onOpenChange={() => setActionID({ courseName })}>
                <EllipsisOutlined />
            </Dropdown>
        )
    }

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
            render: (record: any) =>
                record.map((tag: string, index: number) => {
                    return <Tag key={index} style={{ marginBlock: '3px' }}>{tag[0]} ({weightsLevels.get(Number(tag[1]))})</Tag>
                })
            ,
        },
        {
            title: 'Actions',
            key: 'Actions',
            align: 'center' as AlignType,
            render: (text: string, row: Course) => dropdown(row.name),
        },
    ];

    return (
        <>
            <Divider orientation='left'>Courses Management</Divider>
            <Button type='primary' style={{ marginBlockEnd: '15px' }} onClick={() => {
                setEditTemplateModal(true);
                setModalMode('Add');
                setSelectedCourse(undefined);
            }}>New</Button>
            <Table
                dataSource={courses}
                //@ts-ignore
                columns={columns}
                size='small'
                loading={isLoading}
                bordered
            />
            <Modal
                onOk={() => deleteTemplate()}
                onCancel={() => setDeleteModal(false)}
                open={deleteModal}
                title={DELETE_SURE("course")}
            />
            <CourseModal state={openTemplateModal} weightsLevels={weightsLevels} stateFunc={setEditTemplateModal} course={selectedCourse} mode={modalMode} />
        </>
    )
}

export default Courses;
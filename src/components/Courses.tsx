import { Divider, message, Table, Dropdown, Button, Modal, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { DELETE_SUCCESS, DELETE_SURE } from '../utils/messages';
import { EllipsisOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import type { MenuProps } from 'antd';
import CourseModal from './modals/CourseModal';
import Course from './types/Course';
import Keyword from './types/Keyword';
import DataStore from '../stores/dataStore';
import { observer } from 'mobx-react';

const Courses: React.FC = () => {
    // const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [openTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'Add' | 'Edit'>('Add');
    const [actionID, setActionID] = useState<{ courseName: string }>();

    const weightLevels: Record<number, { level: string, color: string, backgroundColor: string }> = {
        0.25: {
            level: 'Low',
            color: '#333333',
            backgroundColor: '#bce6cb',
        },
        0.5: {
            level: 'Moderate',
            color: '#333333',
            backgroundColor: '#ffe599',
        },
        0.75: {
            level: 'High',
            color: '#ffffff',
            backgroundColor: '#ff9999',
        },
        1: {
            level: 'Max',
            color: '#ffffff',
            backgroundColor: '#ff6666',
        },
    };


    useEffect(() => {
        DataStore.fetchCoursesData(false);
    }, [])

    const deleteTemplate = async () => {
        const url_courses = `${process.env.REACT_APP_BASE_URL}/jce/courses`;
        const response = await fetch(`${url_courses}?name=${actionID?.courseName}`, {
            method: 'DELETE',
        })
        const data = await response.json();
        if (data.statusCode === 200) {
            message.success(DELETE_SUCCESS("Course"));
            DataStore.fetchCoursesData(true);
        } else {
            message.error(data?.error);
        }
        setDeleteModal(false);
    }

    const items: MenuProps['items'] = [
        {
            label: <span onClick={() => {
                setSelectedCourse(DataStore.coursesData?.find((course) => course.name === actionID?.courseName))
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
                record.sort((a: any, b: any) => b.weight - a.weight).map((tag: Keyword, index: number) => { //// @ts-ignore 
                    return <Tag key={index} style={{ marginBlock: '3px', color: weightLevels[tag.weight].color }} color={weightLevels[tag.weight].backgroundColor}><span style={{ fontWeight: '600', fontSize: '1.1em' }}>{tag.keyword.toLowerCase()}</span> <span style={{ fontSize: '.9em' }}>({weightLevels[tag.weight].level})</span></Tag>
                })
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
                dataSource={DataStore.coursesData}
                columns={columns}
                size='small'
                loading={DataStore.coursesData ? false : true}
                bordered
            />
            <Modal
                onOk={() => deleteTemplate()}
                onCancel={() => setDeleteModal(false)}
                open={deleteModal}
                title={DELETE_SURE("course")}
            />
            <CourseModal state={openTemplateModal} weightLevels={weightLevels} stateFunc={setEditTemplateModal} course={selectedCourse} mode={modalMode} />
        </>
    )
}

export default observer(Courses);
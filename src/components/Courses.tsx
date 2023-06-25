import { Divider, message, Table, Button, Modal, Tag, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { DELETE_SUCCESS, DELETE_SURE } from '../utils/messages';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import CourseModal from './modals/CourseModal';
import Course from './types/Course';
import Keyword from './types/Keyword';
import DataStore from '../stores/dataStore';
import { observer } from 'mobx-react';
import dataStore from '../stores/dataStore';

const Courses: React.FC = () => {
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [openTemplateModal, setEditTemplateModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'Add' | 'Edit'>('Add');

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
        const url_courses = `${process.env.REACT_APP_BASE_URL}/courses`;
        const response = await fetch(`${url_courses}?name=${selectedCourse?.name}`, {
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
            render: (_: string, row: Course) =>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <Tooltip title="Edit">
                        <Button type='link' size='small' onClick={() => {
                            setSelectedCourse(DataStore.coursesData?.find((course) => course.name === row.name))
                            setModalMode('Edit');
                            setEditTemplateModal(true);
                        }}>
                            <EditOutlined style={{ fontSize: '1.2em', color: '#3399FF' }} />
                        </Button>
                    </Tooltip>
                    <Divider type='vertical' style={{ backgroundColor: '#dddddd', margin: 0 }} />
                    <Tooltip title="Delete">
                        <Button type='link' size='small' onClick={() => { setSelectedCourse(DataStore.coursesData?.find((course) => course.name === row.name)); setDeleteModal(true) }} danger>
                            <DeleteOutlined style={{ fontSize: '1.2em' }} />
                        </Button>
                    </Tooltip>
                </div>
        },
    ];

    return (
        <>
            <Divider orientation='left'>Courses Management ({dataStore.coursesData?.length})</Divider>
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
                title={
                    <>
                        <ExclamationCircleOutlined style={{ fontSize: '1.5em', color: 'red' }} />
                        <p style={{ marginBlockEnd: '20px' }}>
                            {DELETE_SURE("course '" + selectedCourse?.name + "'")}
                        </p>
                    </>
                }
                okButtonProps={{ style: { backgroundColor: 'red' } }}
            />
            <CourseModal state={openTemplateModal} weightLevels={weightLevels} stateFunc={setEditTemplateModal} course={selectedCourse} mode={modalMode} />
        </>
    )
}

export default observer(Courses);
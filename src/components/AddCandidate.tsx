import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Upload,
    UploadProps,
    Checkbox,
    message,
    Divider,
} from 'antd';
import { UploadOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { MISSING_FIELD, MISSING_FILE, TERMS_AGREEMENT, VALID_EMAIL } from '../utils/messages';

const { TextArea } = Input;

const AddCandidate: React.FC = () => {
    const [form] = Form.useForm();
    const { Dragger } = Upload;

    type UploadForm = {
        first_name: string,
        last_name: string,
        email: string,
        gender: string,
        years_of_exp: string,
        resume: {
            file: File,
            fileList: Array<File>,
        } | string | undefined,
        terms: boolean,
    }

    const onFinish = async () => {
        try {
            const values: UploadForm = await form.validateFields(['resume', 'first_name', 'last_name', 'email', 'terms', 'gender', 'years_of_exp']);
            if (typeof (values.resume) === "object") {
                if (values.resume.fileList.length === 0)
                    throw String("A resume file must be attached");

                // Read resume file, encode to base64 and add to form
                const reader = new FileReader();
                reader.readAsDataURL(values?.resume?.file)
                const readerPromise = new Promise((resolve) => {
                    reader.onload = () => {
                        const resumeEncoded_base64 = String(reader?.result)?.split(',')[1];
                        values.resume = resumeEncoded_base64;
                        resolve(resumeEncoded_base64)
                    }
                })
                // const resumeEncoded_base64 = await readerPromise;
                await readerPromise;
            }

            // API Request AWS Form
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/candidates/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            })

            const data = await response.json();
            console.log(data);

            message.success('Success');
            return
        } catch (err) {
            message.error('Failed: ' + err);
            console.log(err);

            return;
        }
    };

    const props: UploadProps = {
        name: 'file_name',
        multiple: false,
        beforeUpload: () => {
            return false;
        },
    };

    return (
        <>
            <Divider style={{ marginTop: -10, marginBottom: 25 }}>Add a new candidate</Divider>
            <Form
                form={form}
                autoComplete="true"
                name="control-hooks"
                layout="horizontal"
                onFinish={onFinish}
                style={{ display: 'flex', flexDirection: 'column', maxWidth: 'max(65%, 750px)', justifyContent: 'center' }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, flexWrap: 'nowrap' }}>
                    {/* First Name */}
                    <Form.Item style={{ minWidth: '48%' }} name="first_name" label="First Name" htmlFor='firstname' rules={[
                        {
                            type: 'string',
                            required: true,
                            message: MISSING_FIELD("first name"),
                        },
                    ]} hasFeedback>
                        <Input id='firstname' />
                    </Form.Item>

                    {/* Last Name */}
                    <Form.Item style={{ minWidth: '48%' }} name="last_name" label="Last Name" htmlFor='lastname' rules={[
                        {
                            type: 'string',
                            required: true,
                            message: MISSING_FIELD("last name"),
                        },
                    ]} hasFeedback>
                        <Input id='lastname' />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, flexWrap: 'nowrap' }}>
                    {/* Gender */}
                    <Form.Item style={{ minWidth: '48%' }} name="gender" label="Gender" htmlFor='gender' rules={[
                        {
                            type: 'string',
                            required: true,
                            message: MISSING_FIELD("gender"),
                        },
                    ]} hasFeedback>
                        <Select id="gender">
                            <Select.Option value="Male">Male <ManOutlined /></Select.Option>
                            <Select.Option value="Female">Female <WomanOutlined /></Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Years of Experience */}
                    <Form.Item style={{ minWidth: '48%' }} name="years_of_exp" label="Years of Experience" htmlFor='years_of_exp' hasFeedback>
                        <InputNumber min={0} max={99} id='years_of_exp' />
                    </Form.Item>
                </div>

                {/* Email */}
                <Form.Item name="email" label="Email" htmlFor='email' rules={[
                    {
                        required: true,
                        type: 'email',
                        message: VALID_EMAIL,
                    },
                ]} hasFeedback>
                    <Input id='email' />
                </Form.Item>

                {/* Additional Comments */}
                <Form.Item label="Additional Comments" htmlFor='additional' requiredMark="optional" hasFeedback>
                    <TextArea rows={4} showCount maxLength={200} style={{ resize: 'none' }} id='additional' />
                </Form.Item>

                {/* Upload */}
                <Form.Item name="resume" label="Upload" htmlFor='upload' rules={[{
                    required: true,
                    message: MISSING_FILE,
                }]}>
                    <Dragger {...props} maxCount={1} accept=".doc, .docx, .pdf">
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <div className="ant-upload-hint">
                            <div style={{ paddingTop: '15px', display: 'flex', flexDirection: 'row', gap: '5%', justifyContent: 'center', alignItems: 'center' }}>
                                <div>
                                    <svg fill="#63a4ff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 48.2" style={{ scale: '100%' }}>
                                        <path d="M28.9,48.2C19.2,46.5,9.6,44.9,0,43.3C0,30.5,0,17.8,0,4.9C9.6,3.3,19.2,1.6,28.9,0C28.9,16.1,28.9,32,28.9,48.2z  M19.5,32.5c1.2-5.8,2.5-11.5,3.7-17.3c-1.2,0.1-2.2,0.2-3.1,0.3c-0.7,4.1-1.4,8.1-2,12.1c-0.1,0-0.2,0-0.3,0 c-0.8-4-1.5-7.9-2.3-11.9c-1.1,0.1-1.9,0.2-2.9,0.3c-0.8,3.8-1.6,7.6-2.4,11.4c-0.1,0-0.2,0-0.3,0c-0.6-3.7-1.2-7.4-1.8-11.2 c-0.9,0.1-1.7,0.2-2.6,0.4c1,5.3,2,10.4,2.9,15.4c1.1,0,2.1,0,3,0c0.8-3.7,1.5-7.3,2.2-10.8c0.1,0,0.2,0,0.3,0.1 c0.8,3.8,1.5,7.5,2.3,11.3C17.3,32.5,18.3,32.5,19.5,32.5z"></path>
                                        <path d="M30.1,42.4c0-1.7,0-3.4,0-5.2c5.1,0,10.1,0,15.3,0c0-0.7,0-1.2,0-1.9c-5.1,0-10.1,0-15.3,0c0-1.1,0-2,0-3.1 c5.1,0,10.1,0,15.3,0c0-0.6,0-1.2,0-1.8c-5.1,0-10.1,0-15.3,0c0-1.1,0-2,0-3.1c5.1,0,10.2,0,15.3,0c0-0.7,0-1.2,0-1.8 c-5.1,0-10.1,0-15.3,0c0-1.1,0-2,0-3.1c5.1,0,10.1,0,15.2,0c0-0.7,0-1.2,0-1.9c-5.1,0-10.1,0-15.3,0c0-1.1,0-2,0-3.1 c5,0,10.1,0,15.3,0c0-0.7,0-1.2,0-1.9c-5.1,0-10.1,0-15.3,0c0-1.1,0-2,0-3.1c5.1,0,10.2,0,15.3,0c0-0.7,0-1.2,0-1.8 c-5.1,0-10.1,0-15.3,0c0-1.7,0-3.2,0-4.8c6.6,0,13.2,0,19.9,0c0,12.3,0,24.4,0,36.8C43.4,42.4,36.8,42.4,30.1,42.4z"></path>
                                    </svg>
                                    <ul style={{ padding: '0', listStyleType: 'none', listStylePosition: 'outside', textAlign: 'center', display: 'inline' }}>
                                        <li>.doc</li>
                                        <li>.docx</li>
                                    </ul>
                                </div>
                                <div>
                                    <svg fill="#63a4ff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" style={{ scale: '100%' }}>
                                        <path d="M21.9,0C25,1.2,25.8,3.7,26,6.7c0.1,2.2-0.4,4.4-1,6.5c-0.4,1.5-0.9,2.9-1.4,4.4c2.5,3.8,5.6,7.1,8.7,10.4 c1.1,0,2.1,0,3.2,0c2.6,0,5.1,0.3,7.6,1.1c0.9,0.3,1.9,0.7,2.7,1.3c1.9,1.2,2.7,3.3,2,5.4c-0.5,1.8-2.4,3.1-4.6,3.1 c-2,0-3.9-0.5-5.5-1.7c-1.4-1-2.7-2.3-4.1-3.4c-0.9-0.8-1.7-1.6-2.7-2.5c-4.9,0.4-9.9,1.3-14.6,2.7c-1.3,2.3-2.5,4.6-3.9,6.8 c-1.1,1.8-2.4,3.4-3.7,5c-0.7,0.8-1.5,1.5-2.6,1.8C4.5,48.2,3,48.1,1.7,47c-1.4-1.2-2-2.7-1.6-4.5c0.3-1.5,1.1-2.7,2.1-3.8 c2.1-2.3,4.6-4,7.4-5.3c1.4-0.7,2.9-1.2,4.5-1.9c2.1-4.3,4.2-8.8,6-13.4c-0.3-0.5-0.5-0.9-0.8-1.4c-1.9-3.3-2.8-6.9-2.6-10.7 c0-0.8,0.1-1.6,0.3-2.4c0.5-1.7,1.5-2.8,3.2-3.4c0.1,0,0.2-0.1,0.3-0.2C21,0,21.5,0,21.9,0z M28.3,28.3c-2-2.4-4.1-4.8-6.1-7.2 c-1.4,3.1-2.7,6.1-4.1,9.1C21.6,29.6,24.9,29,28.3,28.3z M11.8,35.7c-1.5,0.5-3,1.3-4.3,2.3c-1.2,1-2.4,2.1-3.5,3.2 c-0.5,0.5-0.7,1.2-1,1.8c-0.2,0.7,0.1,1.3,0.6,1.7c0.5,0.5,1.1,0.3,1.6,0c0.5-0.4,1.1-0.8,1.5-1.3C8.9,41.1,10.4,38.4,11.8,35.7z  M35.4,31.1c0,0.1-0.1,0.2-0.1,0.3c1.2,1,2.4,2.1,3.6,3.1c1,0.8,2.1,1.3,3.4,1.4c0.5,0.1,1.1,0.1,1.6-0.1c1.2-0.3,1.5-1.5,0.7-2.4 c-0.3-0.4-0.8-0.6-1.2-0.8C40.8,31.4,38.1,31.2,35.4,31.1z M21.3,3c-0.8,0.3-1,0.5-1.2,1.1c-0.2,0.5-0.3,1-0.3,1.5 c-0.1,2.7,0.3,5.3,1.4,7.8c0.1,0.2,0.2,0.4,0.3,0.6c0.1,0,0.1,0,0.2,0c0.4-1.5,0.8-3,1.1-4.5c0.3-1.3,0.3-2.7,0-4.1 C22.6,4.5,22.3,3.5,21.3,3z"></path>
                                    </svg>
                                    <ul style={{ padding: '0', listStyleType: 'none', listStylePosition: 'outside', textAlign: 'center', display: 'inline' }}>
                                        <li>.pdf</li> </ul>
                                </div>
                            </div>
                        </div>
                    </Dragger>
                </Form.Item>

                {/* Terms and Conditions */}
                <Form.Item name="terms" rules={[{
                    required: true,
                    transform: value => (value || undefined),
                    type: 'boolean',
                    message: TERMS_AGREEMENT,
                }]}
                    valuePropName="checked" hasFeedback>
                    <Checkbox>
                        Agree to our <Link to="#">Terms and Conditions</Link>
                    </Checkbox>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item style={{ textAlign: 'center', marginTop: '15px' }}>
                    <Button block type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AddCandidate;
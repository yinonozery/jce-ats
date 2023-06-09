import { Button, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, GoogleOutlined, ScheduleOutlined, EnvironmentOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, HourglassOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import { MISSING_FIELD } from '../messages';
import TextArea from 'antd/es/input/TextArea';

type eventProps = {
    title: string,
    date: Date,
    name: string,
    email: string,
    videoType: 'GoogleMeet'
}

const GoogleCalendar: React.FC<eventProps | any> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const candidate = JSON.parse(location?.state.candidate);
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_GAPI_KEY;
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/calendar';
    //@ts-ignore
    const gapi = window.gapi, google = window.google;
    const [form] = Form.useForm();
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
    const [expiresIn, setExpiresIn] = useState<string | null>(localStorage.getItem('expires_in'));
    const [tokenClient, setTokenClient] = useState(google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    }))
    function initMap() {
        console.log("sds")
    }
    useEffect(() => {
        if (accessToken && expiresIn && Number(localStorage.getItem('login_date')) + Number(expiresIn) < Math.floor(Date.now() / 1000))
            handleSignoutClick()

        const gisLoaded = () => {
            setTokenClient(google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '',
            }));
        }
        const gapiLoaded = () => {
            gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: [DISCOVERY_DOC],
                });

                if (accessToken && expiresIn) {
                    gapi.client.setToken({
                        access_token: accessToken,
                        expires_in: expiresIn,
                    });
                }
            });
        }
        gapiLoaded()
        gisLoaded()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_KEY, CLIENT_ID, accessToken, expiresIn, gapi, google.accounts.oauth2])

    const handleSigninClick = () => {
        tokenClient.callback = async (resp: any) => {
            if (resp.error) {
                throw (resp);
            }
            const { access_token, expires_in } = gapi.client.getToken();
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('expires_in', expires_in)
            localStorage.setItem('login_date', Math.floor(Date.now() / 1000).toString());

            setAccessToken(localStorage.getItem('access_token'));
            setExpiresIn(localStorage.getItem('expires_in'));
        };

        if (!(accessToken && expiresIn)) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({ prompt: '' });
        }
    }

    const handleSignoutClick = () => {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            localStorage.clear();
            localStorage.removeItem('access_token');
            localStorage.removeItem('expires_in');
            localStorage.removeItem('login_date');
            setAccessToken(null);
            setExpiresIn(null);
        }
    }

    const createCalendar = async () => {
        const calendar = {
            summary: process.env.REACT_APP_EVENTS_CALENDAR_NAME,
            description: 'JCE ATS - Interviews',
            timeZone: 'Asia/Jerusalem',
        };
        try {
            message.info('Creating new calendar in google account...');
            const response = await gapi.client.calendar.calendars.insert({
                resource: calendar,
            });
            const calendarId = response.result.id;
            return calendarId;
        } catch (error) {
            console.error('Error creating calendar:', error);
            return null;
        }
    };

    const checkCalendarExists = async () => {
        try {
            const response = await gapi.client.calendar.calendarList.list();
            const calendars = response.result.items;
            const desiredCalendarSummary = process.env.REACT_APP_EVENTS_CALENDAR_NAME;
            const existingCalendar = calendars.find(
                (calendar: any) => calendar.summary === desiredCalendarSummary
            );
            if (existingCalendar) {
                const existingCalendarId = existingCalendar.id;
                return existingCalendarId;
            } else {
                const calendarId = await createCalendar();
                return calendarId;
            }
        } catch (error) {
            message.error('Google Calendar Error, try again.')
            console.error(error);
        }
    };

    useEffect(() => {
        if (isOnline)
            form.setFieldValue('location', 'Online Meeting')
        else
            form.setFieldValue('location', '')
    }, [form, isOnline])

    const addEvent = async () => {
        const { datePicker, description, location, duration, video } = await form.validateFields();
        const date = new Date(datePicker).getTime();
        const conferenceID = new Date().getTime();
        const calendarId = await checkCalendarExists();

        const event = {
            calendarId: calendarId,
            eventId: 'hangoutsMeet' + conferenceID,
            kind: 'calendar#event',
            summary: 'Jerusalem College Of Engineering Interview',
            location: video ? 'Online - Google Meet' : location,
            description: description,
            conferenceData: {},
            start: {
                dateTime: datePicker?.toISOString(),
                timeZone: 'Asia/Jerusalem'
            },
            end: {
                dateTime: new Date(date + duration * 60000).toISOString(),
                timeZone: 'Asia/Jerusalem'
            },
            attendees: [
                { email: process.env.REACT_APP_ADMIN_GOOGLE_ACCOUNT, responseStatus: 'needsAction' },
                { email: candidate.email, responseStatus: 'needsAction' }
            ],
            reminders: {
                useDefault: true,
            },
            guestsCanSeeOtherGuests: true,
        }
        if (video)
            event['conferenceData'] = {
                createRequest:
                {
                    requestId: conferenceID,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            }

        const request = gapi.client.calendar.events.insert({
            calendarId: calendarId,
            conferenceDataVersion: '1',
            resource: event,
            sendUpdates: 'all',
        })

        request.execute((event: any) => {
            console.log(event)
            window.open(event.htmlLink, '_blank', 'width=800,height=800,left=' + (window.screen.width - 800) / 2 + ',top=' + (window.screen.height - 800) / 2)
        }, (error: any) => {
            console.error(error);
        });
    }

    const initGoogleMapsAutoComplete = () => {
        // Google Maps API
        const input = document.getElementById('location-google');
        const options = {
            componentRestrictions: { country: 'il' },
            fields: ['formatted_address', 'geometry', 'name'],
            strictBounds: false,
            types: ['establishment'],
        };
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        // Add event listener for the 'place_changed' event
        autocomplete.addListener('place_changed', function () {
            // Get the selected place from the Autocomplete object
            const place = autocomplete.getPlace();
            // Access the location information as needed
            // const formattedAddress = place.formatted_address;
            // const geometry = place.geometry;
            const name = place.name;
            // Do something with the selected location information
            form.setFieldValue('location', name)
        });
    }

    initGoogleMapsAutoComplete();

    // console.log(process.env.REACT_APP_EVENTS_CALENDAR_NAME)
    // var request = gapi.client.calendar.events.list({
    //     calendarId: process.env.REACT_APP_EVENTS_CALENDAR_NAME,
    //     'singleEvents': true,
    //     'orderBy': 'startTime',
    // });

    // request.execute((resp: any) => {
    //     console.log(resp);
    // });

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes} minutes`;
        } else if (remainingMinutes === 0) {
            return `${hours} hours`;
        } else {
            return `${hours} hours ${remainingMinutes} minutes`;
        }
    };

    if (!accessToken && !expiresIn) {
        return (
            <Button onClick={handleSigninClick} type='primary' block>
                <GoogleOutlined style={{ marginInline: '5px', padding: '1px', fontSize: '1.2em' }} /> Sign in with Google
            </Button>
        );
    } else {
        return (
            <>
                <Tooltip title='Back to candidates'>
                    <Button icon={<ArrowLeftOutlined />}
                        style={{ position: 'absolute', float: 'left' }}
                        type='ghost'
                        onClick={() => navigate(-1)}
                    >
                    </Button>
                </Tooltip>
                <Divider><ScheduleOutlined style={{ marginInline: '10px' }} />Schedule a Google Calendar Event</Divider>
                <Button onClick={handleSignoutClick} type='primary' block danger>Sign Out</Button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Divider orientation='left'>Candidate Info</Divider>
                    <span><b>Name:</b> {candidate.first_name} {candidate.last_name}</span>
                    <span><b>Email:</b> {candidate.email}</span>
                    <span><b>Work Experience:</b> {candidate.work_experience} Years</span>
                    <span><b>Status:</b> {candidate.status}</span>

                    <Divider orientation='left'>Event Info</Divider>
                    <Form
                        form={form}
                        autoComplete='true'
                        name='control-hooks'
                        layout='horizontal'
                        onFinish={addEvent}
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >

                        {/* Summary */}
                        <Form.Item name='summary' label={<><CalendarOutlined style={{ marginInline: '5px' }} /> Summary</>} htmlFor='summary' rules={[
                            {
                                required: true,
                                message: MISSING_FIELD('Summary'),
                            },
                        ]} required={false}>
                            <Input />
                        </Form.Item>

                        {/* Date & Time */}
                        <Form.Item name='datePicker' label={<><ClockCircleOutlined style={{ marginInline: '5px' }} /> Date & Time</>} htmlFor='datePicker' rules={[
                            {
                                required: true,
                                message: MISSING_FIELD('Date'),
                            },
                        ]} hasFeedback required={false}>
                            <DatePicker
                                disabledDate={(current) => current && current < moment().startOf('day')} // Disabled past dates
                                format='DD/MM/YYYY HH:mm'
                                showTime={{ format: 'HH:mm' }}
                                hideDisabledOptions={true}
                                showNow={false}
                            />
                        </Form.Item>

                        {/* Duration */}
                        <Form.Item name='duration' label={<><HourglassOutlined style={{ marginInline: '5px' }} /> Duration (Minutes)</>} htmlFor='duration' rules={[
                            {
                                required: true,
                                message: MISSING_FIELD('Duration'),
                            },
                        ]}
                            required={false}
                            extra={formatDuration(duration)}
                        >
                            <InputNumber min={5} max={720} step={5} onChange={(dur: number | null) => setDuration(dur ? dur : 0)} />
                        </Form.Item>

                        {/* Description */}
                        <Form.Item name='description' label={<><CommentOutlined style={{ marginInline: '5px' }} /> Description</>} htmlFor='description' rules={[
                            {
                                required: true,
                                message: MISSING_FIELD('Description'),
                            },
                        ]} required={false}>
                            <TextArea />
                        </Form.Item>

                        {/* Location */}
                        <Form.Item name='location' label={<><EnvironmentOutlined style={{ marginInline: '5px' }} /> Location</>} htmlFor='location' rules={[
                            {
                                required: true,
                                message: MISSING_FIELD('Location'),
                            },
                        ]} required={false}>
                            <Input id='location-google' type='text' placeholder='' readOnly={isOnline} />
                        </Form.Item>

                        {/* Video */}
                        <Form.Item label={
                            <>
                                Video Meeting
                                (<Tooltip title='Google Meet'><img src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiNmZmYiIGhlaWdodD0iMTYiIHRyYW5zZm9ybT0icm90YXRlKC05MCAyMCAyNCkiIHdpZHRoPSIxNiIgeD0iMTIiIHk9IjE2Ii8+PHBvbHlnb24gZmlsbD0iIzFlODhlNSIgcG9pbnRzPSIzLDE3IDMsMzEgOCwzMiAxMywzMSAxMywxNyA4LDE2Ii8+PHBhdGggZD0iTTM3LDI0djE0YzAsMS42NTctMS4zNDMsMy0zLDNIMTNsLTEtNWwxLTVoMTR2LTdsNS0xTDM3LDI0eiIgZmlsbD0iIzRjYWY1MCIvPjxwYXRoIGQ9Ik0zNywxMHYxNEgyN3YtN0gxM2wtMS01bDEtNWgyMUMzNS42NTcsNywzNyw4LjM0MywzNywxMHoiIGZpbGw9IiNmYmMwMmQiLz48cGF0aCBkPSJNMTMsMzF2MTBINmMtMS42NTcsMC0zLTEuMzQzLTMtM3YtN0gxM3oiIGZpbGw9IiMxNTY1YzAiLz48cG9seWdvbiBmaWxsPSIjZTUzOTM1IiBwb2ludHM9IjEzLDcgMTMsMTcgMywxNyIvPjxwb2x5Z29uIGZpbGw9IiMyZTdkMzIiIHBvaW50cz0iMzgsMjQgMzcsMzIuNDUgMjcsMjQgMzcsMTUuNTUiLz48cGF0aCBkPSJNNDYsMTAuMTF2MjcuNzhjMCwwLjg0LTAuOTgsMS4zMS0xLjYzLDAuNzhMMzcsMzIuNDV2LTE2LjlsNy4zNy02LjIyQzQ1LjAyLDguOCw0Niw5LjI3LDQ2LDEwLjExeiIgZmlsbD0iIzRjYWY1MCIvPjwvc3ZnPg==' alt='Google Meet' style={{ height: 25 }} /></Tooltip>)
                            </>
                        } required={false}>
                            <Checkbox onChange={(value) => setIsOnline(value.target.checked)} />
                        </Form.Item>

                        {/* Submit */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button style={{ display: (!accessToken && !expiresIn) ? 'none' : 'block' }} type='primary' htmlType='submit'><PlusCircleTwoTone style={{ marginInlineEnd: '5px' }} /> Add Event</Button>
                        </div>
                    </Form>
                </div>
            </>
        )
    }
}

export default GoogleCalendar;
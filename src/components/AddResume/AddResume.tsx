import React, { useState } from "react";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import './style.css';

const AddResume = () => {
    const [file, setFile] = useState<File>()
    const [progress, setProgress] = useState(0)
    const [msg, setMsg] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setFile(e.target!.files[0]);
        ((document.getElementById("file") as HTMLInputElement).style.color = "white")
        file !== undefined && ((document.getElementById("file") as HTMLInputElement).style.color = "royalblue")
    };

    const sendApplicantForm = async (e: any) => {
        e.preventDefault();
        setProgress(0);
        setMsg("");

        // Get all applicant data
        const applicantData = {
            firstName: (document.getElementById("firstName") as HTMLInputElement).value,
            lastName: (document.getElementById("lastName") as HTMLInputElement).value,
            Email: (document.getElementById("email") as HTMLInputElement).value,
            Tel: (document.getElementById("tel") as HTMLInputElement).value,
            Cover: (document.getElementById("cover-letter") as HTMLInputElement).value,
        }

        // Send file to ResumeParser API
        const options = {
            headers: {
                'content-type': file?.type,
                'apikey': 'XVRN3qFzBhCV9DszXcrnisO18IdrMWmv',
            }, onUploadProgress: (progressEvent: any) => {
                const progress = (progressEvent?.loaded / progressEvent?.total) * 100;
                setProgress(progress);
            }
        }
        await axios.post('https://api.apilayer.com/resume_parser/upload', file, options).then((response) => {
            // Send CV file to some service of Resume Parser API
            // Then, save object in our database with user details
            setMsg("CV File Uploaded Successfully")
            console.log(applicantData)
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <div className="container">
            <h1>JCE - Job Application</h1>

            <div className="form">
                <form id="applicant" onSubmit={(e) => sendApplicantForm(e)} autoComplete="on" acceptCharset="utf-8">
                    <div className="applicant_form">
                        <div>
                            <label className="up-label" htmlFor="firstName">First Name <span className="must">*</span></label>
                            <input id="firstName" type="text" required />
                        </div>
                        <div>
                            <label className="up-label" htmlFor="lastName">Last Name <span className="must">*</span></label>
                            <input id="lastName" type="text" required />
                        </div>
                        <div>
                            <label className="up-label" htmlFor="email">E-mail <span className="must">*</span></label>
                            <input id="email" type="email" required />
                        </div>
                        <div>
                            <label className="up-label" htmlFor="tel">Phone Number <span className="must">*</span></label>
                            <input min={9} max={11} id="tel" type="tel" required /></div>
                        <div>
                            <p><label htmlFor="cover-letter">Cover Letter (Optional)</label></p>
                            <textarea id="cover-letter" placeholder="Optional" rows={6} />
                        </div>
                    </div>

                    <div>
                        <p><label htmlFor="cover-letter">Resume (.pdf, .docx, .doc)<span className="must">*</span></label></p>
                        <input type="file" id="file" onChange={handleFileChange} accept=".pdf, .docx, .doc" required />
                        <div>{file && `${file.name.substring(0, file.name.lastIndexOf('.'))} - ${(file.size / (1024 ** 2)).toFixed(2)}Mb`}</div>
                    </div>
                    {progress > 0 ? <div className="linear-progress">
                        <LinearProgress variant="determinate" value={progress} />
                        {progress.toFixed(2)}%
                    </div> : null}
                    <p className="msg">{msg}</p>
                    <button type="submit" className='upload-file'>Apply</button>
                </form>
            </div>

        </div>
    )
}

export default AddResume;
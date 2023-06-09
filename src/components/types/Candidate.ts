type Candidate = {
    id: string,
    first_name: string,
    last_name: string,
    gender: 'Male' | 'Female',
    email: string,
    work_experience: number,
    keywords: Map<string,number>,
    links: string[],
    resume_file_name: string,
    status: 'Available' | 'Accepted' | 'Rejected' | 'In progress',
}

export default Candidate;
type Candidate = {
    id: string,
    first_name: string,
    last_name: string,
    gender: 'Male' | 'Female',
    work_experience: number,
    keywords: any,
    status: 'Available' | 'Accepted' | 'Rejected' | 'In progress',
}

export default Candidate;
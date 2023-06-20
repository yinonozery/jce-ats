// Add Candidate
export const VALID_EMAIL = 'Please enter a valid email address!';
export const MISSING_FIELD = (type: string) => `Please enter a ${type}!`;
export const MISSING_FILE = 'Please upload a resume file';
export const TERMS_AGREEMENT = 'Please agree the terms and conditions.';


// Add Course
export const MISSING_KEYWORDS = (left: number) => `Error: Please enter at least 3 keywords (${left} more)`;
export const MISSING_COURSE_NAME = 'Please enter a course name!';
export const DUPLICATE_KEYWORD = (keyword: string) => `Error: The keyword '${keyword}' already exists. Please enter a different keyword`;

export const FIELD_MIN_LENGTH = (type: string, min: number) => `${type} must be at least ${min} characters long`;
export const FETCHING_DATA_FAILED = 'Failed to fetch data from server';

// Auth
export const LOG_OUT_QUESTION = 'Are you sure you want to log out?';
export const FORGOT_PASS_SUCCESS = "We've sent an email with instructions to reset your password. Please check your inbox and follow the instructions provided.";
export const WRONG_EMAIL = 'The email address entered is not valid or does not exist in our system.'
export const WRONG_PASSWORD = 'The password you entered is incorrect. You can use the "Forgot Password" option to reset it.';

// Modals
export const DELETE_SURE = (item: string) => `Are you sure you want to delete this ${item}?`;
export const DELETE_SUCCESS = (item: string) => `${item} deleted successfully`;
export const ADD_SUCCESS = (item: string) => `${item} added successfully`;
export const UPDATE_SUCCESS = (item: string) => `${item} updated successfully`;
export const ADD_FAILED = (item: string) => `Error: Unable to add new ${item}. Please try again later.`;
export const UPDATE_FAILED = (item: string) => `Error: Failed to update ${item}`;

// Edit Profile Modal
export const REAUTHENTICATION_MSG = 'Please logout and login again to update your email/password.';
export const PASSWORD_CONFIRMATION = 'Please confirm your password!';

// Candidates

// Edit Candidate
export const EDIT_CANDIDATE_MSG = '* Please note that to update the resume file or keywords for this candidate, kindly delete the current candidate and add a new candidate with the desired file and keywords.';
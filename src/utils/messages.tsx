// Add Candidate
export const VALID_EMAIL = "Please enter a valid email address!";
export const MISSING_FIELD = (type: string) => `Please enter a ${type}!`;
export const MISSING_FILE = "Please upload a resume file";
export const TERMS_AGREEMENT = "Please agree the terms and conditions.";


// Add Course
export const MISSING_KEYWORDS = (left: number) => `Error: Please enter at least 3 keywords (${left} more)`;
export const MISSING_COURSE_NAME = "Please enter a course name!";
export const DUPLICATE_KEYWORD = (keyword: string) => `Error: The keyword '${keyword}' already exists. Please enter a different keyword`;

export const FIELD_MIN_LENGTH = (type: string, min: number) => `${type} must be at least ${min} characters long`;
export const FETCHING_DATA_FAILED = "Failed to fetch data from server";

// Auth
export const LOG_OUT_QUESTION = "Are you sure you want to log out?";

// Modals
export const DELETE_SURE = (item: string) => `Are you sure you want to delete this ${item}?`;
export const DELETE_SUCCESS = (item: string) => `${item} deleted successfully`;
export const ADD_SUCCESS = (item: string) => `${item} added successfully`;

// Edit Profile Modal
export const REAUTHENTICATION_MSG = "Please logout and login again to update your email/password.";
export const PASSWORD_CONFIRMATION = "Please confirm your password!";
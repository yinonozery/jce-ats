# Managing & Filtering Candidates for Teaching Positions 

<sup> Department of Software Engineering, Final project 2023</sup>
<p align="center">
  <img src="https://github.com/yinonozery/jce-ats/assets/74764366/e5eaea8f-a426-42c6-8831-14819c1ab988" width="350">
</p>

> **Note**
> Restricted Access for Security Reasons
> 
> Due privacy and confidentiality reasons, login details, including usernames and passwords, cannot be provided for this project. Access to sensitive information, such as personal details, resume files, and more, is intentionally restricted. Safeguarding this data is my top priority as the author of this project. If you have any inquiries or require further information, please feel free to contact me directly.

## Introduction
The purpose of the project is to develop a system for the college and especially the recruitment department whose job is to manage and store the resumes of candidates.
Providing various options such as search, association with relevant courses, analysis of the resume file (doc/docx/pdf), maintaining touch with the candidate throughout the recruitment process, and additional actions on each candidate.
If there is a lack of a lecturer/practitioner in some courses, with the help of the system we can reach suitable candidates relatively easily without having to go through dozens of resumes.


## Stack
**Client-side:** `React, TypeScript, Ant Design, MobX (State Management)`

**Server-side:** `Serverless with AWS Lambda Functions (Python & Node.js) and API Gateway, Firebase (User Authentication)`

**Storage** `AWS Simple Storage Service (S3)`

**Database:** `AWS DynamoDB`

**Other services:** `AWS Simple Email Service (SES), Google API (Maps & Calendar)`

## Hiring Manager Use Case
![image](https://user-images.githubusercontent.com/74764366/214918318-17b339b4-267e-4759-a773-cd2246e0d989.png)

## Applicant Use Case
![image](https://user-images.githubusercontent.com/74764366/214918985-6808efb3-a78a-406d-b907-20e3ad0253fe.png)


## Risk Management Table
**Legend:**
<kbd>1 = Minor | 2 = Moderate | 3 = Critical</kbd>

|     Risk                                                                                                                                                                                      	|     Prob      	|     Impact    	|     Risk Code    	|     Mitigation Plan/Contingency Plan                                                                                                                                        	|
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|---------------	|---------------	|------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
|     **Data security**<br>     Unauthorized access to the database or for the system to be   compromised by malicious actors                                                                           	|     Medium    	|     High      	|     2            	|     1. Manage an access control rules<br>     2. Thoroughly testing                                                                                                            	|
|     **Regulatory compliance**<br>     Violation of regulatory requirements can lead to fines or other   penalties.                                                                                    	|     Medium    	|     High      	|     2            	|     1. Conducting a legal review of similar systems<br>     2. Keeping detailed records of data activities<br>     3. Compliance with industry standards                            	|
|     **Technical issues**<br>     Compatibility problems or errors in the software, which could   prevent recruiters from effectively using the system.                                                	|     Medium    	|     Medium    	|     2            	|     1. Identify potential technical issues and to address them   before they can cause problems<br>     2. Thoroughly testing<br>     3. Updates<br>     4. Technical documentation    	|
|     **System downtime**<br>     System is unavailable due to system failures or maintenance,   which could prevent recruiters from accessing the system to review resumes or   schedule interviews<br>    	|     Low       	|     Medium    	|     1            	|     1. Regular maintenance<br>     2. Monitoring<br>     3. Backups<br>     4. Choose powerful, popular, secure cloud services                                                          	|
|     **Delay**<br>     There may be delays due to personal matters, difficulty in   learning the subject, difficulty in implementation, and more.                                                      	|     High      	|     High      	|     3            	|     1. Well-defined project plan<br>     2. Flexibility<br>     3. Schedule carefully                                                                                                	|

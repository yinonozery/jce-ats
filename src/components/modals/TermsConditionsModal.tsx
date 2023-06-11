import { Divider, Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface modalProps {
    state: boolean,
    stateFunc: Dispatch<SetStateAction<boolean>>;
}

const TermsConditionsModal: React.FC<modalProps> = (props) => {
    return (
        <Modal
            open={props.state}
            onCancel={() => props.stateFunc(false)}
            footer={null}
        >
            <Divider>Terms and Conditions</Divider>
            <p>These Terms and Conditions ("Agreement") are entered into between [Your Company Name] ("Company") and the user ("User") of [Your Company Name]'s website, products, and services ("Services"). By accessing or using the Services, User agrees to be bound by the terms and conditions set forth in this Agreement.</p>

            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using the Services, User acknowledges that they have read, understood, and agree to be bound by all the terms and conditions stated in this Agreement, along with any additional terms and conditions provided by the Company. If User does not agree to these terms and conditions, they should not access or use the Services.</p>

            <h3>2. Services</h3>
            <p>The Services provided by the Company may include, but are not limited to, the following:<br />
                - [Describe the services provided]</p>

            <h3>3. User Obligations</h3>
            <p>User agrees to:<br />
                - Provide accurate, current, and complete information when using the Services<br />
                - Use the Services for lawful purposes only and comply with all applicable laws and regulations<br />
                - Maintain the confidentiality of any login credentials or account information provided by the Company<br />
                - Not use the Services in a manner that may interfere with or disrupt the Company's servers, networks, or other infrastructure<br />
                - Not attempt to gain unauthorized access to the Services or any accounts, systems, or networks connected to the Services</p>

            <h3>4. Intellectual Property</h3>
            <p>The Company retains all rights, ownership, and interest in its intellectual property, including but not limited to trademarks, copyrights, logos, and trade secrets associated with the Services. User agrees not to copy, distribute, modify, or create derivative works of the Company's intellectual property without prior written consent.</p>

            <h3>5. Privacy</h3>
            <p>User's privacy is important to the Company. The Company's Privacy Policy governs the collection, use, and disclosure of personal information provided by User. By using the Services, User consents to the collection, use, and disclosure of their personal information as described in the Privacy Policy.</p>

            <h3>6. Limitation of Liability</h3>
            <p>In no event shall the Company be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the Services, even if the Company has been advised of the possibility of such damages. User's sole remedy for dissatisfaction with the Services is to stop using them.</p>

            <h3>7. Indemnification</h3>
            <p>User agrees to indemnify and hold the Company harmless from any claims, losses, liabilities, damages, costs, or expenses (including attorney's fees) arising out of or relating to User's use of the Services, violation of this Agreement, or infringement of any intellectual property or other rights of any person or entity.</p>

            <h3>8. Termination</h3>
            <p>The Company may terminate or suspend User's access to the Services at any time, with or without cause or notice. Upon termination, User shall immediately cease all use of the Services, and any provisions of this Agreement that, by their nature, should survive termination shall survive.</p>

            <h3>9. Governing Law</h3>
            <p>This Agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising out of or relating to this Agreement shall be resolved in the courts of [Your Jurisdiction].</p>

            <h3>10. Entire Agreement</h3>
            <p>This Agreement constitutes the entire agreement between the Company and User regarding the Services and supersedes all prior agreements and understandings, whether written or oral.</p>

            <p>By accessing or using the Services, User acknowledges that they have read, understood, and agree to be bound by all the terms and conditions stated in this Agreement.</p>

            <p>If you have any questions or concerns regarding this Agreement, please contact us at [Your Contact Information].</p>

            <p>Date: {Date()}</p>

        </Modal>
    )
}

export default TermsConditionsModal;
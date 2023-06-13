import { Divider } from 'antd';

const Home: React.FC = () => {

    return (
        <div>
            <Divider orientation='left' style={{ color: 'black' }}>Applicant Tracking System of JCE Software Engineering Department</Divider>
            <p>Efficiently manage resumes, analyze files, associate with courses, and streamline recruitment.</p>
            <p>Simplify search, maintain communication, and find suitable candidates for lecturer/practitioner positions.</p>
            <p style={{ textAlign: 'center' }}><img style={{ maxWidth: '20%' }} src='https://i.ibb.co/9gvbBX6/talent.png' alt='ATS' /></p>
            <Divider>Project Stack</Divider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <img height='50' src='https://camo.githubusercontent.com/e84431cfbd9f7c44b1c20da1dde8ad407cbc31174844a428074d1e3b43faab8b/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f64657669636f6e732f64657669636f6e2f69636f6e732f72656163742f72656163742d6f726967696e616c2d776f72646d61726b2e737667' alt='' />|
                <img height='50' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png' alt='' />|
                <img height='50' src='https://camo.githubusercontent.com/442c452cb73752bb1914ce03fce2017056d651a2099696b8594ddf5ccc74825e/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f64657669636f6e732f64657669636f6e2f69636f6e732f6a6176617363726970742f6a6176617363726970742d6f726967696e616c2e737667' alt='' />|
                <img height='50' src='https://camo.githubusercontent.com/626fb60c4c17c2cf2ad0e599efaa8ed691ede878ce1e94b85c0c401701716f8e/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f64657669636f6e732f64657669636f6e2f69636f6e732f6e6f64656a732f6e6f64656a732d6f726967696e616c2d776f72646d61726b2e737667' alt='' />|
                <img height='50' src='https://camo.githubusercontent.com/c2e5be901c932b65a9987e6ae32cc19394d4ccb8c5d30d858216d054d6294f31/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f64657669636f6e732f64657669636f6e2f69636f6e732f707974686f6e2f707974686f6e2d6f726967696e616c2d776f72646d61726b2e737667' alt='' />|
                <img height='50' src='https://camo.githubusercontent.com/715227adcbce086f9b1e9ffa7b50efb637451aaef673a7a2438a12c9bd1bd90a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f64657669636f6e732f64657669636f6e2f69636f6e732f66697265626173652f66697265626173652d706c61696e2d776f72646d61726b2e737667' alt='' />|
                <img height='50' src='https://camo.githubusercontent.com/b705a9cfab48be8f5c15b22bffd64328071d5956a22570b009a15ae3cf304aed/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f64657669636f6e732f64657669636f6e2f69636f6e732f616d617a6f6e77656273657276696365732f616d617a6f6e77656273657276696365732d6f726967696e616c2d776f72646d61726b2e737667' alt='' />
            </div>
        </div>
    )
}

export default Home;
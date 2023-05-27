import { observer } from "mobx-react";
import appConfig from "../stores/appStore";
import { Spin } from "antd";

const Spinner = () =>
    <div id="overlay" style={{ display: appConfig.isLoading ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <Spin size='large' style={{ fontSize: '1.2em', fontWeight: 'bold' }} tip={'Loading...'} />
    </div>
export default observer(Spinner);

import { observer } from "mobx-react";
import AppConfig from "../stores/appStore";
import { Spin } from "antd";

const Spinner = () =>
    <div id="overlay" style={{ display: AppConfig.isLoading ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <Spin size='large' style={{ fontSize: '1.2em', fontWeight: 'bold' }} tip={'Loading...'} />
    </div>
export default observer(Spinner);

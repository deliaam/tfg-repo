// project imports
import MainCard from 'ui-components/MainCard';

import { TabPanel } from '@mui/lab';
import TasksPanel from './TasksPanel';
import { useParams } from 'react-router';

// ==============================|| TYPOGRAPHY ||============================== //

const ClassPanel = () => {
    return (
        <>
            <TabPanel value="1">
                <TasksPanel />
            </TabPanel>
            <TabPanel value="2">Preguntas</TabPanel>
        </>
    );
};

export default ClassPanel;

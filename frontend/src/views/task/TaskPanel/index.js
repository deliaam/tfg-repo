// project imports
import MainCard from 'ui-components/MainCard';

import { TabPanel } from '@mui/lab';
import SolutionsPanel from './SolutionsPanel';
import { useParams } from 'react-router';

// ==============================|| TYPOGRAPHY ||============================== //

const TaskPanel = () => {
    return (
        <>
            <TabPanel value="1">
                <SolutionsPanel />
            </TabPanel>
            <TabPanel value="2">Preguntas</TabPanel>
        </>
    );
};

export default TaskPanel;

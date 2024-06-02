// project imports
import MainCard from 'ui-components/MainCard';

import { TabPanel } from '@mui/lab';
import SolutionsPanel from './SolutionsPanel';
import QuestionPanel from 'views/class/ClassPanel/QuestionsPanel';
import { useParams } from 'react-router';

// ==============================|| TYPOGRAPHY ||============================== //

const TaskPanel = () => {
    return (
        <>
            <TabPanel value="1">
                <SolutionsPanel />
            </TabPanel>
            <TabPanel value="2">
                <QuestionPanel />
            </TabPanel>
        </>
    );
};

export default TaskPanel;

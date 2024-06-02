import { lazy } from 'react';
import Loadable from 'ui-components/Loadable';

//layouts
import ClassListLayout from 'views/classList/ClassListLayout';
import ClassLayout from 'views/class/ClassLayout';
import TaskLayout from 'views/task/TaskLayout';
import SolutionLayout from 'views/solutions/SolutionLayout';
import RevisionLayout from 'views/revisions/RevisionLayout';
import QuestionLayout from 'views/question/QuestionLayout';
import RankingLayout from 'views/ranking/RankingLayout';

//panel
const ClassListPanel = Loadable(lazy(() => import('views/classList/ClassListPanel')));
const ClassPanel = Loadable(lazy(() => import('views/class/ClassPanel')));
const TaskPanel = Loadable(lazy(() => import('views/task/TaskPanel')));
const SolutionPanel = Loadable(lazy(() => import('views/solutions/SolutionPanel')));
const RevisionPanel = Loadable(lazy(() => import('views/revisions/RevisionPanel')));
const QuestionPanel = Loadable(lazy(() => import('views/question/QuestionPanel')));
const RankingPanel = Loadable(lazy(() => import('views/ranking/RankingPanel')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/home',
    children: [
        {
            path: 'classes',
            element: <ClassListLayout />,
            children: [
                {
                    path: '',
                    element: <ClassListPanel />
                }
            ]
        },
        {
            path: 'classes/class',
            element: <ClassLayout />,
            children: [
                {
                    path: '',
                    element: <ClassPanel />
                }
            ]
        },
        {
            path: 'classes/class/requests',
            element: <RevisionLayout />,
            children: [
                {
                    path: '',
                    element: <RevisionPanel />
                }
            ]
        },
        {
            path: 'classes/class/task',
            element: <TaskLayout />,
            children: [
                {
                    path: '',
                    element: <TaskPanel />
                }
            ]
        },
        {
            path: 'classes/class/question',
            element: <QuestionLayout />,
            children: [
                {
                    path: '',
                    element: <QuestionPanel />
                }
            ]
        },
        {
            path: 'classes/class/task/question',
            element: <QuestionLayout />,
            children: [
                {
                    path: '',
                    element: <QuestionPanel />
                }
            ]
        },
        {
            path: 'classes/class/task/solution',
            element: <SolutionLayout />,
            children: [
                {
                    path: '',
                    element: <SolutionPanel />
                }
            ]
        },
        {
            path: 'classes/class/ranking',
            element: <RankingLayout />,
            children: [
                {
                    path: '',
                    element: <RankingPanel />
                }
            ]
        }
    ]
};

export default MainRoutes;

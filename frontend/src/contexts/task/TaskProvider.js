import React, { createContext, useState, useEffect } from 'react';
import taskService from 'services/task.service';
import { TaskContext } from './TaskContext';
import { useContext } from 'react';
import { ClassContext } from 'contexts/class/ClassContext';
import { useSelector } from 'react-redux';
export const TaskProvider = ({ children }) => {
    const [tasksList, setTasksList] = useState(undefined);
    const { classObj } = useContext(ClassContext) || { classObj: undefined };
    const userId = useSelector((state) => state.auth.user.id);
    const getClassTasks = async () => {
        if (classObj != undefined) {
            try {
                const response = await taskService.getTasks(classObj.id, userId);
                setTasksList(response);
            } catch (error) {
                console.log(error);
                setTasksList([]);
            }
        }
    };

    useEffect(() => {
        getClassTasks();
    }, []);
    return <TaskContext.Provider value={{ tasksList, setTasksList }}>{children}</TaskContext.Provider>;
};

export default TaskProvider;

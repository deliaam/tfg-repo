import React, { createContext, useState, useEffect } from 'react';
import questionService from 'services/question.service';
import { QuestionContext } from './QuestionContext';
import { useContext } from 'react';
import { ClassContext } from 'contexts/class/ClassContext';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

export const QuestionProvider = ({ children }) => {
    const [questionsList, setQuestionsList] = useState(undefined);
    const {
        state: { classObj, taskObj }
    } = useLocation();
    const userId = useSelector((state) => state.auth.user.id);
    const getQuestions = async () => {
        console.log(classObj);
        console.log(taskObj);
        if (classObj != undefined) {
            try {
                const response = await questionService.getQuestions(classObj.id, taskObj ? taskObj.task.id : null);
                setQuestionsList(response);
            } catch (error) {
                console.log(error);
                setQuestionsList([]);
            }
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);
    return <QuestionContext.Provider value={{ questionsList, setQuestionsList }}>{children}</QuestionContext.Provider>;
};

export default QuestionProvider;

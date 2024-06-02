import React, { createContext, useState, useEffect } from 'react';
import lessonService from 'services/lesson.service';
import { LessonContext } from './LessonContext';
import { useContext } from 'react';
import { ClassContext } from 'contexts/class/ClassContext';

export const LessonProvider = ({ children }) => {
    const [lessonsList, setLessonsList] = useState(undefined);
    const { classObj } = useContext(ClassContext) || { classObj: undefined };
    const getClassLessons = async () => {
        if (classObj != undefined) {
            try {
                const response = await lessonService.getClassLessons(classObj.id);
                setLessonsList(response);
            } catch (error) {
                console.log(error);
                setLessonsList([]);
            }
        }
    };

    useEffect(() => {
        getClassLessons();
    }, []);
    return <LessonContext.Provider value={{ lessonsList, setLessonsList }}>{children}</LessonContext.Provider>;
};

export default LessonProvider;

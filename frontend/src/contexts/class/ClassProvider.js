import React, { createContext, useState, useEffect } from 'react';
import ClassService from 'services/class.service';
import { ClassContext } from './ClassContext';
import { useLocation } from 'react-router';

export const ClassProvider = ({ children }) => {
    const {
        state: { classObj }
    } = useLocation();
    console.log(classObj);
    return <ClassContext.Provider value={{ classObj }}>{children}</ClassContext.Provider>;
};

export default ClassProvider;

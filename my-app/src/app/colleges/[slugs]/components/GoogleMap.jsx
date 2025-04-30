'use client'; 

import React from 'react';

const GoogleMap = ({ mapUrl }) => {
    return (
        <div
            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 rounded-lg"
            dangerouslySetInnerHTML={{ __html: mapUrl }}
        />
    );
};

export default GoogleMap;
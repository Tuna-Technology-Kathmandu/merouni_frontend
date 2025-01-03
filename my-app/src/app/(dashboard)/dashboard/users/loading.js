import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <Skeleton width={150} height={24} />
            <div className="flex space-x-2">
              <Skeleton width={24} height={24} circle />
              <Skeleton width={24} height={24} circle />
            </div>
          </div>
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
        </div>
      ))}
    </div>
  );
};

export default Loading;

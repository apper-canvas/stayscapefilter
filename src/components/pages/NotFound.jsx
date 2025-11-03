import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-primary-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          <ApperIcon name="Home" className="w-5 h-5 mr-2" />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
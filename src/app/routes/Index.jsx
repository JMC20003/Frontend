import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { authProtectedRoutes, publicRoutes } from './allRoutes';
import AuthProtected from './AuthProtected';
import PublicRoute from './PublicRoute';

const RouteIndex = () => {
  return (
    <React.Fragment>
      <Routes>
        {authProtectedRoutes.map((route, idx ) => (          
          <Route
            key={idx}
            path={route.path}
            element={              
              <AuthProtected>
                <route.component />
              </AuthProtected>              
            }
          />
        ))}
        {publicRoutes.map((route, idx ) => (          
          <Route
            key={idx}
            path={route.path}
            element={              
              <PublicRoute>
                <route.component /> 
              </PublicRoute>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;

import React from 'react';
function WithRenderFormFromConfig(Component) {
  return function WithRenderFormFromConfig({...props }) {
    console.log("RenderView props:", props);
    return <Component {...props} />;
  };
}
export default WithRenderFormFromConfig;


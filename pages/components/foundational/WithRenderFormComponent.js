import React from 'react';
function WithRenderFormComponent(Component) {
  return function WithRenderFormComponent({...props }) {
  //  console.log("RenderFormComponent props:", props);
    return <Component {...props} />;
  };
}
export default WithRenderFormComponent;

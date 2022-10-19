import React from 'react';
function WithRenderForm(Component) {
  return function WithRenderComponent({ ...props }) {
    console.log('RenderView props:', props);
    return <Component {...props} />;
  };
}
export default WithRenderForm;

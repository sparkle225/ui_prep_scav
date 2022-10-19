
import React from "react";


import ErrorBoundary from './foundational/ErrorBoundary';
import Link from 'next/link'

function UserView(props){
       
      
    if (props.userInfo!==undefined && props.userInfo!==null) {
        console.log("map in render-userview", props.userInfo);
        return (
        <ErrorBoundary appConfig={props.appConfig}>
        <div>
        <div className={""}>
        <label className={"control-label labelTitle "} htmlFor="FULLNAME">Full Name</label>
        <div>
            {props.userInfo.fullName}
        </div></div>
        <br/>
        {(props.isAdmin || props.isOpsAdmin)?<div className={""} >
        <label className={"control-label labelTitle "} htmlFor={"Saved Searches"}>ADMIN TOOLS</label>
        <div>
        <Link className="tstarfont" to={props.appConfig.APP_ABSOLUTE_ADMIN_TOOLS} target="_self" style={{ color: 'red' }} onClick={() => { props.toggleProfilePopup()}} ><i className="fa fa-link"></i> Admin Tools</Link>
        </div>
        <br/>
        </div>: null} 
        <div className={""}>
        <label className={"control-label labelTitle "} htmlFor="GROUPS">Groups Member Of:</label>
        <div>
            <ul>
        {props.userInfo.userGroups!==undefined && props.userInfo.userGroups!==null && props.userInfo.userGroups.length>0?
          props.userInfo.userGroups.map(group=>{if(group !==undefined) {return (<li>{group.groupName}</li>)}}):" You are not currently a member of any group."}
          </ul>
        </div>
        </div>
        <br/>
        <div className={""}>
        <label className={"control-label labelTitle "} htmlFor={"Saved Searches"}>Saved Searches</label>
        <div>
            {"Coming Soon..."}
        </div>
        </div>
        <br/>
        <div className={""}>
        <label className={"control-label labelTitle "} htmlFor={"Report Templates"}>Report Templates</label>
        <div>
            {"Coming Soon..."}
        </div>
        </div>
        </div>
        </ErrorBoundary>
       );
    } else {
        console.log("for some reason data state is null-itemchangedetail");
        return null;
    }

}

export default UserView;



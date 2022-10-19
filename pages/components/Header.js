import React, { Suspense, lazy } from 'react';

import UserView from './UserView';
import Banner from './foundational/Banner';


export default function Header(props) {
    console.log("Headerprops:", props);
    console.log("props.termsAccepted:",props.termsAccepted,"(props.appConfig != null:",props.appConfig," props.userInfo:",props.userInfo,"props.notIngest === true:",props.notIngest === true );
   return ( 
   
   <div>

        <Banner></Banner>
        <Banner></Banner>
    </div>
   );
}

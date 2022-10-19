import React from "react";

import {Button} from 'react-bootstrap';


//var Button = ReactBootstrap.Button;

function Disclaimer(props) {
    console.log("disclaimer render")


    return (
        
        <div style={{margin:"auto",width:"500px"}}> <p>
                <b> YOU ARE ACCESSING A U.S. GOVERNMENT (USG) INFORMATION SYSTEM (IS) THAT IS PROVIDED FOR USG-AUTHORIZED USE ONLY.
                <br/> By using this IS (which includes any device attached to the IS), you consent to the following conditions:</b>
                <br/><br/> - The USG routinely intercepts and monitors communications on this IS for purposes including, but not limited
                to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law enforcement
                (LE), and coutnerintelligence (CI) investigations.
                <br/> - At any time, the USG may inspect and seize data stored on this IS.
                <br/> - Communications using, or data stored on, this IS are not priivate, are subject to routine monitoring, interception,
                and search, and may be disclosed or used for any USG-authorized purpose.
                <br/> - This IS includes security measures (e.g. authentication and access controls) to protect USG interests--not
                for your personal benefit or privacy.
                <br/> - Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching
                or monitoring of the content of privileged communications, or work product, related to personal representation or
                services by attorneys, psychotherapists, or clergy, and their assisstants. Such communications and work product are
                private and confidential. See User Agreement for details.
                <br/>
            </p><Button className="btn-sm btn-default"
                    onClick={() => {
                        props.handleDisclaimer();
                    }}>
                ACCEPT

                </Button></div>
    )

}

export default Disclaimer;

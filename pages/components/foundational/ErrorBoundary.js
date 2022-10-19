import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log("error in ErrorBoundary", error);
       // this.props.addAuditEvent(this._getEntityTypeByLayerName(layerName)!==undefined?this._getEntityTypeByLayerName(layerName).value:"", this.state.appConfig.EVENT_ACTION_READ, this.state.appConfig.EVENT_RESULT_STATE_ERROR, this.state.strikeId,null, null, null, this.state.appConfig.INITIATOR_TYPES.USER,this.state.data.userInfo.fullName, queryUrl);
        //auditError(error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h1>{this.props.appConfig.BASE_ERROR_MESSAGE}</h1>
        }
        return this.props.children;
    }
}

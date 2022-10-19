import React from 'react';



export default class BaseViewDetail extends React.Component {
    constructor(props) {
        super(props);

        this._itemEditing = this._itemEditing.bind(this);
        this._submitData = this._submitData.bind(this);
        this._validate = this._validate.bind(this);
        this._executeFunctionByName = this._executeFunctionByName.bind(this);
        this.getUIFieldByDataFieldNameAndType = this.getUIFieldByDataFieldNameAndType.bind(this);
        this._mustPopulate = this._mustPopulate.bind(this);

    }

   
}

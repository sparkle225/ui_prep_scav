
import React from "react";
//import ReactDOM from "react-dom";
//import styles from "./index.css"; //uncomment this line prior to webpacking for deployment

class TextInput extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (nextProps.value !== this.props.value || nextProps.editing !== this.props.editing || nextProps.defaultValue != this.props.defaultValue);
    }
    render() {
        if (this.props.editing === true || this.props.editing === undefined) {
            if (this.props.validation !== undefined) {
                //validate the field
                return (
                    <input
                        readOnly={this.props.readonly}
                        disabled={this.props.disabled}
                        type={this.props.inputType}
                        id={this.props.itemId}
                        name={this.props.name}
                        key={this.props.key}
                        className={this.props.classes + " form-control"}
                        placeholder={this.props.placholder}
                        maxLength={this.props.maxlength}
                        min={this.props.min}
                        defaultValue={this.props.defaultValue}
                        value={this.props.value}
                        onChange={(e) => this.props.onChange(e, this.props.validation)}
                        onClick={this.props.onClick}
                        onFocus={(e) => this.props.onFocus(e, this.props.validation.validate.rule(e), this.props.validation.validate.displayText)}
                        onBlur={() => this.props.onBlur()}
                        onMouseOut={() => this.props.onMouseOut(1000)}
                        onMouseOver={(e) => this.props.onMouseOver(e, this.props.validation.validate.rule(e), this.props.validation.validate.displayText)}
                    />
                );
            }
            //no validation
            return (
                <input
                    readOnly={this.props.readonly}
                    disabled={this.props.disabled}
                    type={this.props.inputType}
                    id={this.props.itemId}
                    name={this.props.name}
                    key={this.props.key}
                    maxLength={this.props.maxlength}
                    min={this.props.min}
                    className={this.props.classes + " form-control"}
                    placeholder={this.props.placholder}
                    defaultValue={this.props.defaultValue}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onClick={this.props.onClick}
                    onBlur={this.props.onBlur}
                />
            );
        }
        return (<div id={this.props.itemId} className={this.props.classes + ' field-view-only'}>{(this.props.defaultValue !== undefined &&  this.props.defaultValue !== null &&  this.props.defaultValue !== "" ?  this.props.defaultValue : "No Data")}</div>);
    }
}

class TextAreaInput extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (nextProps.value !== this.props.value || nextProps.editing !== this.props.editing || nextProps.defaultValue != this.props.defaultValue)
    }
    render() {
        if (this.props.editing === true || this.props.editing === undefined) {
            return (
                <textarea
                    readOnly={this.props.readonly}
                    rows='3'
                    style={this.props.style}
                    id={this.props.itemId}
                    name={this.props.name}
                    key={this.props.key}
                    maxLength={this.props.maxlength}
                    className={this.props.classes + ' form-control'}
                    defaultValue={this.props.defaultValue}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
            );
        }
        return (<div id={this.props.itemId} className={this.props.classes + ' field-view-only'}>{(this.props.defaultValue !== undefined &&  this.props.defaultValue !== null &&  this.props.defaultValue !== "" ?  this.props.defaultValue : "No Data") }</div>);
    }
}

class SelectInput extends React.Component {
    constructor(props) {
        super(props);
        //this.getSelectValue = this.getSelectValue.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.value !== this.props.value || nextProps.editing !== this.props.editing || nextProps.defaultValue != this.props.defaultValue )
    }

    render() {
        if (this.props.editing === true || this.props.editing === undefined) {
            if (this.props.validation !== undefined) {
                //validate the field
                console.log(this.props.options);
                return (
                    <select
                        readOnly={this.props.readonly}
                        id={this.props.itemId}
                        name={this.props.name}
                        className={this.props.classes + " form-control"}
                        placeholder={this.props.placholder}
                        onFocus={this.props.onFocus}
                        onBlur={this.props.onBlur}
                        name={this.props.name}
                        value={this.props.value}
                        onChange={(e) => this.props.onChange(e, this.props.validation)}
                        onClick={this.props.onClick}
                        onFocus={(e) => this.props.onFocus(e, this.props.validation.validate.rule(e), this.props.validation.validate.displayText)}
                        onBlur={() => this.props.onBlur()}
                        onMouseOut={() => this.props.onMouseOut(1000)}
                        onMouseOver={(e) => this.props.onMouseOver(e, this.props.validation.validate.rule(e), this.props.validation.validate.displayText)}
                    >
                        {this.props.options.map(elm => {
                            console.log(elm);
                            return (
                                <option key={elm.key} value={elm.key}>{elm.value}</option>
                            );
                        })}
                    </select>
                )
            }
            //no validation
            console.log(this.props.options);
            return (

                <select
                    readOnly={this.props.readonly}
                    id={this.props.itemId}
                    name={this.props.name}
                    className={this.props.classes + " form-control"}
                    placeholder={this.props.placholder}
                    onChange={this.props.onChange}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                >
                    {this.props.options.map(elm => {
                        return (
                            <option key={elm.key} value={elm.key}>{elm.value}</option>
                        );
                    })}
                </select>
            );
        }
        return (<div id={this.props.itemId} className={this.props.classes + ' field-view-only'}>{(this.props.defaultValue !== undefined &&  this.props.defaultValue !== null &&  this.props.defaultValue !== "" ?  this.props.handleSelectGetValue(this.props.options, this.props.defaultValue) : "No Data")}</div>);
    }
}

class MultiSelectInput extends React.Component {
    constructor(props) {
        super(props);
        //this.getSelectValue = this.getSelectValue.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.value !== this.props.value || nextProps.editing !== this.props.editing || nextProps.defaultValue != this.props.defaultValue )
    }

    render() {
        if (this.props.editing === true || this.props.editing === undefined) {
            if (this.props.validation !== undefined) {
                //validate the field
                console.log(this.props.options);
                return (
                    <select
                        readOnly={this.props.readonly}
                        id={this.props.itemId}
                        name={this.props.name}
                        className={this.props.classes + " form-control"}
                        placeholder={this.props.placholder}
                        defaultValue={this.props.defaultValue}
                        onChange={this.props.onChange}
                        onFocus={this.props.onFocus}
                        onBlur={this.props.onBlur}
                        name={this.props.name}
                        value={this.props.value}
                        onChange={(e) => this.props.onChange(e, this.props.validation)}
                        onClick={this.props.onClick}
                        onFocus={(e) => this.props.onFocus(e, this.props.validation.validate.rule(e), this.props.validation.validate.displayText)}
                        onBlur={() => this.props.onBlur()}
                        onMouseOut={() => this.props.onMouseOut(1000)}
                        onMouseOver={(e) => this.props.onMouseOver(e, this.props.validation.validate.rule(e), this.props.validation.validate.displayText)}
                        multiple
                    >
                        {this.props.options.map(elm => {
                            console.log(elm);
                            return (
                                <option key={elm.key} value={elm.key}>{elm.value}</option>
                            );
                        })}
                    </select>
                )
            }
            //no validation
            console.log(this.props.options);
            return (

                <select
                    readOnly={this.props.readonly}
                    id={this.props.itemId}
                    name={this.props.name}
                    className={this.props.classes + " form-control"}
                    placeholder={this.props.placholder}
                    defaultValue={this.props.defaultValue}
                    onChange={this.props.onChange}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    multiple
                >
                    {this.props.options.map(elm => {
                        return (
                            <option key={elm.key} value={elm.key}>{elm.value}</option>
                        );
                    })}
                </select>
            );
        }
        return (<div id={this.props.itemId} className={this.props.classes + ' field-view-only'}>{(this.props.defaultValue !== undefined &&  this.props.defaultValue !== null &&  this.props.defaultValue !== "" ?  this.props.handleMultiSelectGetValues(this.props.options, this.props.defaultValue) : "No Data")}</div>);
    }
}
/* 
module.exports = {
    SelectInput: SelectInput,
    TextAreaInput: TextAreaInput,
    TextInput: TextInput,
    MultiSelectInput:MultiSelectInput
} */

export {SelectInput, TextAreaInput, TextInput, MultiSelectInput};

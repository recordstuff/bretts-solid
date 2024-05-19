import React, { ErrorInfo } from "react";
import { connect } from 'react-redux';
import { clearAllWaits } from '../reducers/WaitSpinnerSlice'
import { Dispatch } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { HTTP_STATUS_CODES } from "../services/HttpClient";

interface Props {
    children?: React.ReactNode,
    clearAllWaits: () => void
}

interface State {
    hasError: boolean
    suppressMessage : boolean
    message: string
    name: string
}

// ChatGPT said there is a useErrorBoundary() hook now and there is not (yet).  
// there is a package which sounds like it doesn't work too well.
// https://www.npmjs.com/package/react-use-error-boundary

class ErrorBoundary extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, suppressMessage: false, message: '', name: '' };
    }

    public static getDerivedStateFromError(error: Error) {
        return { hasError: true, supressMessage: false, message: error.message, name: error.name }
    }

    public componentDidMount(): void {
        window.addEventListener('error', (event: ErrorEvent) => {
            this.setState({ hasError: true, suppressMessage: false, message: event.message, name: 'Error' })
        });

        window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
            const suppressMessage = event.reason instanceof AxiosError 
                                 && event.reason.response?.status === HTTP_STATUS_CODES.FORBIDDEN

            this.setState({ hasError: true, suppressMessage, message: event.reason.toString(), name: event.type })
        });
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // clear all waits just in case this.state.hasError is reset somehow (as in the case of hot reload)
            this.props.clearAllWaits()
            
            if (this.state.suppressMessage)
                return <></>
            
            return (
                <>
                    <h1>Unfortunate Occurance</h1>
                    <p>The application experienced a problem.</p>
                    <p>Unhandled Error {this.state.name !== "Error" ? `: ${this.state.name}` : ''}</p>
                    <p>{this.state.message}</p>
                </>
            )
        }

        return this.props.children
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    clearAllWaits: () => dispatch(clearAllWaits()),
});

export default connect(null, mapDispatchToProps)(ErrorBoundary)
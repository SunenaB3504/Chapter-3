/*******************************************************************************
**
** FileName: SCORM_API_wrapper.js
**
*******************************************************************************/

var findAPITries = 0;
var API = null;
var noAPIFound = "false";

function FindAPI(win) {
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        if (findAPITries > 500) {
            alert("Error finding API -- too deeply nested.");
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

function GetAPI() {
    var theAPI = FindAPI(window);
    if ((theAPI == null) && (window.opener != null) && (typeof (window.opener) != "undefined")) {
        theAPI = FindAPI(window.opener);
    }
    if (theAPI == null) {
        noAPIFound = "true";
    }
    return theAPI;
}

// SCORM 1.2 API Wrapper
var API_12 = null;
var ScormProcessInitialize = ScormProcessInitialize_12;
var ScormProcessTerminate = ScormProcessTerminate_12;
var ScormProcessGetValue = ScormProcessGetValue_12;
var ScormProcessSetValue = ScormProcessSetValue_12;
var ScormProcessCommit = ScormProcessCommit_12;
var ScormProcessGetLastError = ScormProcessGetLastError_12;
var ScormProcessGetErrorString = ScormProcessGetErrorString_12;
var ScormProcessGetDiagnostic = ScormProcessGetDiagnostic_12;

function ScormProcessInitialize_12() {
    var result;
    API_12 = GetAPI();
    if (noAPIFound == "true") {
        //alert ("SCORM API not found"); // Optional Alert
        console.warn("SCORM API not found - Running in standalone mode.");
        return "false";
    }
    result = API_12.LMSInitialize("");
    if (result == "false") {
        var errorNumber = ScormProcessGetLastError_12();
        var errorString = ScormProcessGetErrorString_12(errorNumber);
        var diagnostic = ScormProcessGetDiagnostic_12(errorNumber);
        alert("Error initializing communication with LMS.\n\nError " + errorNumber + ": " + errorString + "\n\nDiagnostic: " + diagnostic);
        return "false";
    }
    return result;
}

function ScormProcessTerminate_12() {
    var result;
    if (noAPIFound == "true") { return "false"; }
    result = API_12.LMSFinish("");
    if (result == "false") {
        var errorNumber = ScormProcessGetLastError_12();
        var errorString = ScormProcessGetErrorString_12(errorNumber);
        var diagnostic = ScormProcessGetDiagnostic_12(errorNumber);
        alert("Error terminating communication with LMS.\n\nError " + errorNumber + ": " + errorString + "\n\nDiagnostic: " + diagnostic);
        return "false";
    }
    API_12 = null;
    return result;
}

function ScormProcessGetValue_12(element) {
    var result;
    if (noAPIFound == "true") { return ""; } // Return empty string if no API
    result = API_12.LMSGetValue(element);
    // You may want to add error handling here based on LMSGetLastError
    return result;
}

function ScormProcessSetValue_12(element, value) {
    var result;
    if (noAPIFound == "true") { return "false"; }
    result = API_12.LMSSetValue(element, value);
    if (result == "false") {
        var errorNumber = ScormProcessGetLastError_12();
        var errorString = ScormProcessGetErrorString_12(errorNumber);
        // Optional: alert("Error setting " + element + "\n\nError " + errorNumber + ": " + errorString);
        console.error("Error setting " + element + " - Error " + errorNumber + ": " + errorString);
    }
    return result;
}

function ScormProcessCommit_12() {
    var result;
    if (noAPIFound == "true") { return "false"; }
    result = API_12.LMSCommit("");
    if (result == "false") {
        var errorNumber = ScormProcessGetLastError_12();
        var errorString = ScormProcessGetErrorString_12(errorNumber);
        // Optional: alert("Error committing data.\n\nError " + errorNumber + ": " + errorString);
        console.error("Error committing data - Error " + errorNumber + ": " + errorString);
    }
    return result;
}

function ScormProcessGetLastError_12() {
    if (noAPIFound == "true") { return "0"; } // Return "no error" if no API
    return API_12.LMSGetLastError();
}

function ScormProcessGetErrorString_12(errorNumber) {
    if (noAPIFound == "true") { return "No SCORM API found."; }
    return API_12.LMSGetErrorString(errorNumber);
}

function ScormProcessGetDiagnostic_12(errorNumber) {
    if (noAPIFound == "true") { return "SCORM API not available."; }
    return API_12.LMSGetDiagnostic(errorNumber);
}

// Utility function to make SCORM calls easier to read
function scorm_Initialize() { return ScormProcessInitialize(); }
function scorm_Terminate() { return ScormProcessTerminate(); }
function scorm_GetValue(element) { return ScormProcessGetValue(element); }
function scorm_SetValue(element, value) { return ScormProcessSetValue(element, value); }
function scorm_Commit() { return ScormProcessCommit(); }
function scorm_GetLastError() { return ScormProcessGetLastError(); }
function scorm_GetErrorString(errorNumber) { return ScormProcessGetErrorString(errorNumber); }
function scorm_GetDiagnostic(errorNumber) { return ScormProcessGetDiagnostic(errorNumber); }

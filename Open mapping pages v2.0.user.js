// ==UserScript==
// @name         Open mapping pages v2.0
// @version      0.1
// @description  Gets list of IC9 codes from user and opens tables
// @author       Laetitia Tam
// @match        https://www.encoderpro.com/epro/
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==


var icdUrl = "https://www.encoderpro.com/epro/i9v3PcsMappingHandler.do?_a=list&_k=";
var cptUrl = "https://www.encoderpro.com/epro/crosscodesHandler.do?_k=104*"; //35.12&_a=listRelated";
var icdDUrl = "https://www.encoderpro.com/epro/icd10MappingHandler.do?_k=103*";

var codeType = prompt("Do you want ICD-10 Procedure (IP), ICD-10 Diagnosis (ID), or CPT (C) codes? Enter IP, ID, or C:");
var icd9Input = prompt("Enter ICD9 codes separated by a space:");
var delay = prompt("Enter delay in ms (start at 2000):");

var codeList = icd9Input.split(" ");




for (i = 0; i < codeList.length; i++) {
    (function(i){
        window.setTimeout(function(){
        	if (codeType == "IP" || codeType == "ip") {
            icd10MapUrl = icdUrl + codeList[i];
        } else if (codeType == "C" || codeType == "c") {
        	icd10MapUrl = cptUrl + codeList[i] + "&_a=listRelated";
        }
            else if (codeType == "ID" || codeType == "id") {
        	icd10MapUrl = icdDUrl + codeList[i] + "&_a=listRelated";
        }
            window.open(icd10MapUrl);
        
        }, i * delay);
    }(i));

} 



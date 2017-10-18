// ==UserScript==
// @name         EncoderPro Scrape ICD 9 to CPT 1.0
// @version      1.0
// @description  Scrapes CPT codes from the EncoderPro mapping table
// @author       Laetitia Tam
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.js
// @include      https://www.encoderpro.com/epro/crosscodesHandler.do?_k=104*
// @exclude      "https://www.encoderpro.com/epro/crosscodesHandler.do?_k=104*&_a=listRelated"
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==


var col1List = [];
var col2List = [];

// set persistent icd9 code and description variables
// this only runs on first page
if (document.URL.match(/https:\/\/www\.encoderpro\.com\/epro\/crosscodesHandler\.do\?_k=/)) {
    x = document.URL.slice(-20,-15);
    GM_setValue("icd9", x); 
    y = $("div td tr:nth-of-type(2) > td:nth-of-type(3)").text();
    y = y.split(" - ");
    y = y[1].trim();
    y= y.replace(/;/g, "");
    GM_setValue("description", y);
}

function magic_beans(){
    // create output file
    //get original ICD-9 code and description
    var icd9code = GM_getValue("icd9");
    var icd9desc = GM_getValue("description");

    // get lists of first and second table columns
    col1List = generate_output("span.cptCode a"); 
    col2List =  generate_output("td.listBoxTableCell:nth-of-type(2) span");
    csvList = combine_lists(icd9code, icd9desc, col1List, col2List);

    // output file
    var blob = new Blob(csvList, {type: "text/plain;charset=utf-8"});   
    saveAs(blob, "output_" + icd9code + ".txt");
}

// create semicolon delimited list
function combine_lists(code, description, list1, list2){
    x = [];
    for (i = 0; i < list1.length; i++) {
        
            x.push(code, "?", description, "?", list1[i], "?", list2[i], "\n");
        }
    return(x);
}

// get list of text from a column
function generate_output (element){
    var colList = [];
    $(element).each(function(){
        x = $(this).text();
        colList.push(x);       
    });
    return(colList);
}

magic_beans();
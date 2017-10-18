// ==UserScript==
// @name         EncoderPro Scrape ICD 9 to 10 Diagnosis v1.0
// @version      1.0
// @description  Scrapes the ICD 10 crosswalks
// @author       Laetitia Tam
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.js
// @include      https://www.encoderpro.com/epro/icd10MappingHandler.do?_k=103*
// @exclude      https://www.encoderpro.com/epro/icd10MappingHandler.do?_a=open&openedImgIds=&_k=undefined&_
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==


var col1List = [];
var col2List = [];

// set persistent icd9 diagnosis code and description variables
// this only runs on first page
if (document.URL.match(/https:\/\/www\.encoderpro\.com\/epro\/icd10MappingHandler\.do\?_k=/)) {
    x = document.URL.slice(-21,-15);
    GM_setValue("icd9d", x);
    y = $("div td table:nth-of-type(1) table td.infobox td:nth-of-type(2)").text();
    //y = y.split(" - ");
    console.log(y);
    //y = y[1].trim();
    //y= y.replace(/;/g, "");
    GM_setValue("description", y);
}

function magic_beans(){
    // create output file
    //get original ICD-9 code and description
    var icd9code = GM_getValue("icd9d");
    var icd9desc = GM_getValue("description");

    // get lists of first and second table columns
    col1List = generate_output("span.i10cmCode a");
    col2List =  generate_output("td.listBoxTableCell:nth-of-type(3) span");
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
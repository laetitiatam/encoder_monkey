// ==UserScript==
// @name         EncoderPro Scrape ICD 9 to 10 Procedure v1.0
// @version      1.0
// @description  Recursively refreshes the window with the exapnded ICD-10 mapping table and downloads the final table
// @author       Laetitia Tam
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.js
// @include      https://www.encoderpro.com/epro/i9v3PcsMappingHandler.do?_a=list&_k=*
// @include      https://www.encoderpro.com/epro/i9v3PcsMappingHandler.do?_a=open&openedImgIds=*
// @exclude      https://www.encoderpro.com/epro/i9v3PcsMappingHandler.do?_a=open&openedImgIds=&_k=undefined&_
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==


var id4List = [];
var col1List = [];
var col2List = [];

// set persistent icd9 code and description variables
// this only runs on first page
if (document.URL.match(/https:\/\/www\.encoderpro\.com\/epro\/i9v3PcsMappingHandler\.do\?_a=list&_k=/)) {
    x = document.URL.slice(-5);
    GM_setValue("icd9", x); 
    y = $("td.infobox td tr:nth-of-type(2) td:nth-of-type(2)").first().text();
    console.log(y);
    GM_setValue("description", y);

    // set counter
    GM_setValue("expandCount", 0); 
}

function magic_beans(){
    get_ids();
    make_url(id4List);

    GM_setValue("expandCount", GM_getValue("expandCount")+1); 
    var counter =  GM_getValue("expandCount");

    // expands the mapping table 3 times
    if (counter <3 ){
        // open expanded table URL
        window.location.href = url;
    } else {
        // create output file
        //get original ICD-9 code and description
        var icd9code = GM_getValue("icd9");
        var icd9desc = GM_getValue("description");

        // get lists of first and second table columns
        col1List = generate_output("span.i10pcsCode"); 
        col2List =  generate_output("td.listBoxTableCell:nth-of-type(2) span");
        csvList = combine_lists(icd9code, icd9desc, col1List, col2List);

        // output file
        var blob = new Blob(csvList, {type: "text/plain;charset=utf-8"});
        saveAs(blob, "output_" + icd9code + ".txt");
    }

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

// create semicolon delimited list
function combine_lists(code, description, list1, list2){
    x = [];
    for (i = 0; i < list1.length; i++) {
        if (list1[i].length == 7) {
            x.push(code, "?", description, "?", list1[i], "?", list2[i], "\n");
        }} 
    return(x);
}

// get all image ids (which contain ICD10 code)
function get_ids() {
    $("img[id^='img_']").each(function(index) {
        thisId = $(this).attr("id");
        id4List.push(thisId);
    });
}

// trim ids into correct format for generating the URL
function trim_ids(list) {
    for (i = 0; i < id4List.length; i++) {
        list[i] = list[i].slice(6,list[i].length);
    }
}

// generate URL for expanded table
function make_url(list) {
    trim_ids(id4List);
    url = "https://www.encoderpro.com/epro/i9v3PcsMappingHandler.do?_a=open&openedImgIds=";
    for (i = 0; i < id4List.length-1; i++) {
        url = url.concat(id4List[i], ",");
    }
    url = url.concat("&_k=", id4List[id4List.length-1], "&_");
}

magic_beans();
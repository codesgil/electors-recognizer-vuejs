const FileSaver = require("file-saver");
const XLSX = require("xlsx");
const canvg = require("canvg-browser");
import Vue from "vue";
import Util from "./Utils";
const _emailPattern = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const _phonePattern = /^((237|00)?(6([5-9][0-9]{7}))|((242|243)[0-9]{6}))$/;

const Utils = {
  restrictDate: function(date, interval = 30) {
    let now = new Date();
    let receiveDate = new Date(date);
    let timeDiff = Math.abs(receiveDate.getTime() - now.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > interval) {
      receiveDate.setDate(receiveDate.getDate() + interval);
      now = receiveDate;
    }
    return now;
  },

  saveAsFile: (blob, fileName) => {
    FileSaver.saveAs(blob, fileName);
  },

  getImageOption: (type = "png") => {
    let option = "image/png";
    if (type === "jpeg") {
      option = "image/jpeg";
    }
    return option;
  },

  saveAsExcell: (
    datas = [],
    fileName = "file",
    title = "title",
    sheetName = "sheet"
  ) => {
    let wb = XLSX.utils.book_new();
    let json_data = XLSX.utils.json_to_sheet(datas, { origin: "A2" });
    let key = [];
    let start = true;
    Vue._.forEach(datas, obj => {
      if (start) {
        key = Vue._.keys(obj);
        start = false;
      }
    });
    let letterNumber = key.length + 96;
    let letter = String.fromCharCode(letterNumber).toUpperCase();
    json_data["A1"] = { v: title };
    let merge = XLSX.utils.decode_range("A1:" + letter + "1");
    if (!json_data["!merges"]) json_data["!merges"] = [];
    json_data["!merges"].push(merge);
    XLSX.utils.book_append_sheet(wb, json_data, sheetName);
    XLSX.writeFile(wb, fileName + ".xlsx");
  },

  saveAsImage: (chartContainer, type = "png", fileName = "file") => {
    let chartArea = chartContainer.getElementsByTagName("svg")[0].parentNode;
    let svg = chartArea.innerHTML;
    let doc = chartContainer.ownerDocument;
    let canvas = doc.createElement("canvas");
    canvas.setAttribute("width", chartArea.offsetWidth);
    canvas.setAttribute("height", chartArea.offsetHeight);
    canvas.setAttribute(
      "style",
      "position: absolute; " +
        "top: " +
        -chartArea.offsetHeight * 2 +
        "px;" +
        "left: " +
        -chartArea.offsetWidth * 2 +
        "px;"
    );
    doc.body.appendChild(canvas);
    canvg(canvas, svg);
    let option = Util.getImageOption(type);
    canvas.toBlob(blob => {
      fileName = fileName + "." + type;
      FileSaver.saveAs(blob, fileName);
    }, option);
    canvas.parentNode.removeChild(canvas);
  },
  getBadEmailLine: emails => {
    emails = emails.trim();
    let res = emails.split("\n");
    let val = "";
    res.forEach(function(email, key) {
      if (!_emailPattern.test(email)) {
        let cle = key + 1;
        val = cle + " : < " + email + " > ";
      }
    });

    return val;
  },
  getBadPhoneLine: phones => {
    phones = phones.trim();
    let res = phones.split("\n");

    let val = "";
    let first = true;

    res.forEach(function(phone, key) {
      if (phone.length < 9 && first) {
        first = false;
        let cle = key + 1;
        val = cle + " : < " + phone + " > ";
      }
    });

    res.forEach(function(phone, key) {
      if (!_phonePattern.test(phone)) {
        let cle = key + 1;
        val = cle + " : < " + phone + " > ";
      }
    });

    return val;
  }
};

export default Utils;

import PathURL from "./URL";
import store from "../store";
import Vue from "vue";

const _phonePattern = /^((237|00)?(6([5-9][0-9]{7}))|((242|243)[0-9]{6}))$/;

const _emailPattern = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isPhone = number => {
  return _phonePattern.test(number);
};

export const isPhonesList = phones => {
  if (phones) {
    phones = phones.trim();
    let res = phones.split("\n");
    let val = true;
    res.forEach(function(phone) {
      if (phone.length < 9) {
        val = false;
      }
    });
    if (!val) return val;
    res.forEach(function(phone) {
      if (!_phonePattern.test(phone)) {
        val = false;
      }
    });
    return val;
  }
  return true;
};

export const isEmailList = emails => {
  emails = emails.trim();
  let val = true;
  let res = emails.split("\n");
  res.forEach(function(email) {
    if (!_emailPattern.test(email)) val = false;
  });
  return val;
};

export const dateIsGreatThan = (max, component) => {
  let end = new Date(max);
  let tempStart = component.start;
  let start = new Date(tempStart);
  return start.getTime() <= end.getTime();
};

export const isUniqueUsername = (value, component) => {
  if (
    !Vue._.has(value, "length") ||
    value === null ||
    value.length < 3 ||
    value.length > 10 ||
    component["oldUsername"] === value
  ) {
    return true;
  }
  return new Promise(resolve => {
    store
      .dispatch("request", {
        url: PathURL.USER.UNIQUE_USERNAME.URI,
        method: PathURL.USER.UNIQUE_USERNAME.METHOD,
        data: {
          username: value
        }
      })
      .then(() => {
        resolve(false);
      })
      .catch(() => {
        resolve(true);
      });
  });
};

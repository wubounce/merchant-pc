/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/* 合法uri*/
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* 手机号*/
export function validatPhone (str) {
  const reg = /^(1)\d{10}$/;
  return reg.test(str);
}

/* 密码 */
export const validatPwd = str => {
  const reg = /^[a-zA-Z0-9]{6,20}$/;
  return reg.test(str);
};

/* 用户名中文*/
export const validatName = str => {
  const reg = /^[\(\)\（\）\u0391-\uFFE5]{2,20}$/;
  return reg.test(str);
};

/* 邀请码 */
export const validatInviteCode = str => {
  const reg = /^[0-9]{5}$/;
  return reg.test(str);
};

// 邮箱
export const validatEmail = str => {
  const reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
  return reg.test(str);
};

// 邮箱
export const validatShopName = str => {
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9_-]{2,16}$/;
  return reg.test(str);
};

/**
 * 订单补偿券
 *
 */
export const validatPrice = str => {
  const reg = /^(([1-9][0-8]|[1-9])(\.\d{1,2})?|0\.[1-9]|0\.[0-9][1-9])$/;
  return reg.test(str);
};

export const validatNum = str => {
  const reg = /^[1-9]+\d*$/;
  return reg.test(str);
};

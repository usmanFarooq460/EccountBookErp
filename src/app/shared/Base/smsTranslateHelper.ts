export const smsTranslateHelper = (smsBody: string, formObject) => {
  let matches = smsBody.match(/@(\w+)/g);
  if (matches) {
    matches.forEach((param) => {
      let key = param.replace(/@|{|}/g, "");
      smsBody = smsBody.replace(param, formObject[key]);
    });
  }
  return smsBody;
  // let translationArr = [];
  // smsBody.replace(/@(\w+)/g, (match, field) => {
  //   Object.keys(formObject).map((key) => {
  //     if (key == field) {
  //       translationArr.push(formObject[key]);
  //     }
  //   });
  //   return match;
  // });
  // return translationArr.toString().split(",").join(" ");
};

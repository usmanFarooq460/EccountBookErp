export class TwoDimentionalArrayBuilder {
  GenerateTwoDimentionalArray(data, BaseColumnName) {
    let twoDiminsionalArray = new Array<any>();
    for (let i = 0; i < data.length; i++) {
      let flag = this.CheckIfPropertyWithSameValueIsAlreadyPresentInTwoDiminsionalArray(twoDiminsionalArray, BaseColumnName, data[i][BaseColumnName]);
      if (flag == false) {
        let recordToBePushed = this.FilterDataWithSamePropertyValues(data, BaseColumnName, data[i][BaseColumnName]);
        if (recordToBePushed != null && recordToBePushed.length > 0) {
          twoDiminsionalArray.push(recordToBePushed);
        }
      }
    }
    return twoDiminsionalArray;
  }
  CheckIfPropertyWithSameValueIsAlreadyPresentInTwoDiminsionalArray(twoDimentionalArray, PropertyName, PropertyValue) {
    if (twoDimentionalArray != null && twoDimentionalArray.length > 0) {
      let flag = false;
      for (let i = 0; i < twoDimentionalArray.length; i++) {
        if (twoDimentionalArray[i][0][PropertyName] == PropertyValue) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  FilterDataWithSamePropertyValues(list, PropertyName, PropertyValue) {
    let filteredData = [];
    if (list != null && list != undefined) {
      for (let i = 0; i < list.length; i++) {
        if (list[i][PropertyName] == PropertyValue) {
          filteredData.push(list[i]);
        }
      }
    }
    return filteredData;
  }
}

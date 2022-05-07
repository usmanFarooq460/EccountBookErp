import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';


@Pipe({
  name: 'filterByAllProperties'
})
export class FilterByAllPropertiesPipe implements PipeTransform {

  transform(value: any,filterString:string) {
    if (value!=null && value != "" && value!=undefined && filterString!=null && filterString!="") {

      let PropertiesList=Object.keys(value[0]);
      let FilterResult=[]
      for(let i=0;i<value.length;i++)
      {
        for(let j=0;j<PropertiesList.length;j++)
        {
          if(typeof(value[i][PropertiesList[j]])!='object')
          {
            let valueToBeCompared=value[i][PropertiesList[j]];
            if(valueToBeCompared!=null && valueToBeCompared!=undefined)
            {
                          if(typeof(valueToBeCompared)=='number')
            {
              valueToBeCompared=valueToBeCompared.toString()
            }

            valueToBeCompared=valueToBeCompared.toLowerCase()
            if(valueToBeCompared.includes(filterString)){
              FilterResult.push(value[i]);
              break;
            }
            }

          }
        }
      }
      return FilterResult 
    }
    else{
      return value;
    }
  }

}

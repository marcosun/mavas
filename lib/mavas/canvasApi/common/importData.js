export default function importData(data) {
  //modify structure and save to original
  let type;
  
  switch(this.options.type) {
    case 'polyline':
      type = 'polyline';
      break;
    case 'curve':
    case 'quadraticCurve':
      type = 'curve';
      break;
  };
  
  const save = (data) => {
    let currentLine, currentPoint, newCurrentLine;
    
    for(let ia = 0, lena = data.length; ia < lena; ia++) {
      currentLine = data[ia];
      newCurrentLine = {
        coords: [],
        lnglat: [],
        lineStyle: data[ia].lineStyle,
      };

      for(let ib = 0, lenb = currentLine.coords.length; ib < lenb; ib++) {
        currentPoint = currentLine.coords[ib];

        newCurrentLine.coords.push(currentPoint);
        newCurrentLine.lnglat.push(new AMap.LngLat(currentPoint[0], currentPoint[1]));
      };

      this[type].original.push(newCurrentLine);
    };
  };
  
  this[type] = {};
  this[type].original = [];
  
  save(data);
};
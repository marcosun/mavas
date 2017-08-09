import transformOptions from './options';

export default function updatePalette(outerOptions) {
  let options = transformOptions(outerOptions);
  
  this.import(options.data);
}
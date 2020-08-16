const path = require('path');
const fs = require('fs');
const p = path.join(
  path.dirname(process.mainModule.filename), //указывает на обсолютный путь
  'data',
  'basket.json'
);
class Basket{
  static async delete(id) {

    const baskets = await Basket.fitchBasket();

    const idx = baskets.courses.findIndex(c => c.id === id)
    const course = baskets.courses[idx];
  
    if(course.count === 1) {
      baskets.courses = baskets.courses.filter(c => c.id !== id);
      baskets.count -= 1;
    } else {
      baskets.courses[idx].count--;
    }
      baskets.price -= course.price;
      
     return new Promise((resolve, reject) =>{
        fs.writeFile(p, 
          JSON.stringify(baskets),
          err =>{
            if(err) {
              reject(err);
            } else {
              resolve(baskets);
            }
          })
      })
  }

  static async add(course) {
    const baskets = await Basket.fitchBasket();

    const id = baskets.courses.findIndex(c => c.id === course.id)
    const candidate = baskets.courses[id];

    if(candidate){
      //if current course exist
      candidate.count++;
      baskets.courses[id] = candidate;
    }else{
      //else current course will write
      baskets.count ++;
      course.count += 1;
      baskets.courses.push(course)
    }
    
    baskets.price += +course.price;

    return new Promise((resolve, reject) =>{
      fs.writeFile(p,
        JSON.stringify(baskets),
        err =>{
          if(err) reject('addBasket',err);
          resolve();        
        })
    }) 
    
  }
  static async fitchBasket(){
   return new Promise((resolve, reject) => {
    fs.readFile(p,
      'utf-8', 
      (err, content) =>{
        if(err) reject(err);
        resolve(JSON.parse(content));
      })
   }) 
  }
}

module.exports = Basket;
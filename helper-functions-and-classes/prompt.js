
class Prompt {
  constructor(name,type,message) {
    this.name = name;
    this.type = type;
    this.message = message;
    this.validate = val => {
      if (isNaN(val) === false) {
        if (val === '') {
          console.log('Provide a number!')
          return false;
        }
        return true;
      } else if (val.toUpperCase() === 'Q') {
        return true;
      }
      return false;
    };
  }
}

module.exports = Prompt;

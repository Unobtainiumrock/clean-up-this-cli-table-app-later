
class Prompt {
  constructor(name,type,message) {
    this.name = name;
    this.type = type;
    this.message = message;
  }

  validate(val) {
    if (isNaN(val) === false) {
      return true;
    } else if (val.toUpperCase === 'Q') {
      return true;
    }
    return false;
  }

}

module.exports = Prompt;

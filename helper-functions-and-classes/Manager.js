
const Prompt = require('./prompt');

class ManagerPrompt extends Prompt {
  constructor(name, type, message, choices) {
    super(name,type,message)
    this.choices = choices
    this.validate = null;
  }
}

module.exports = ManagerPrompt;
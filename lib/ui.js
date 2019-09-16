const chalk = require('chalk');
const emoji = require('node-emoji');

/**
 * Coverage tool output formatters. These classes support any the logging solidity-coverage API
 * (or plugins which consume it) do on their own behalf. NB, most output is generated by the host
 * dev stack (ex: the truffle compile command, or istanbul).
 */
class UI {
  constructor(log){
    this.log = log || console.log;
    this.chalk = chalk;
  }

  /**
   * Writes a formatted message
   * @param  {String}   kind  message selector
   * @param  {String[]} args  info to inject into template
   */
  report(kind, args=[]){}

  /**
   * Returns a formatted message. Useful for error messages.
   * @param  {String}   kind  message selector
   * @param  {String[]} args  info to inject into template
   * @return {String}         message
   */
  generate(kind, args=[]){}

  _write(msg){
    this.log(this._format(msg))
  }

  _format(msg){
    return emoji.emojify(msg)
  }
}

/**
 * UI for solidity-coverage/lib/app.js
 */
class AppUI extends UI {
  constructor(log){
    super(log);
  }

  /**
   * Writes a formatted message via log
   * @param  {String}   kind  message selector
   * @param  {String[]} args  info to inject into template
   */
  report(kind, args=[]){
    const c = this.chalk;
    const ct = c.bold.green('>');
    const ds = c.bold.yellow('>');
    const w = ":warning:";

    const kinds = {
      'vm-fail': `${w}  ${c.red('There was a problem attaching to the ganache-core VM.')} `+
                       `${c.red('Check the provider option syntax in solidity-coverage docs.')}\n`+
                 `${w}  ${c.red('Using ganache-core-sc (eq. core v2.7.0) instead.')}\n`,


      'instr-start': `\n${c.bold('Instrumenting for coverage...')}` +
                     `\n${c.bold('=============================')}\n`,

      'instr-skip':  `\n${c.bold('Coverage skipped for:')}` +
                     `\n${c.bold('=====================')}\n`,

      'instr-item':    `${ct} ${args[0]}`,
      'instr-skipped': `${ds} ${c.grey(args[0])}`,

      'istanbul': `${ct} ${c.grey('Istanbul reports written to')} ./coverage/ ` +
                        `${c.grey('and')} ./coverage.json`,

      'cleanup': `${ct} ${c.grey('solidity-coverage cleaning up, shutting down ganache server')}`,

      'server':  `${ct} ${c.bold('server: ')}           ${c.grey(args[0])}`,
    }

    this._write(kinds[kind]);
  }

  /**
   * Returns a formatted message. Useful for error message.
   * @param  {String}   kind  message selector
   * @param  {String[]} args  info to inject into template
   * @return {String}         message
   */
  generate(kind, args=[]){
    const c = this.chalk;

    const kinds = {
      'instr-fail': `${c.red('Could not instrument:')} ${args[0]}. ` +
                    `${c.red('(Please verify solc can compile this file without errors.) ')}`,

      'istanbul-fail': `${c.red('Istanbul coverage reports could not be generated. ')}`,

      'sources-fail': `${c.red('Cannot locate expected contract sources folder: ')} ${args[0]}`,

      'server-fail': `${c.red('Could not launch ganache server. Is ')}` +
                     `${args[0]} ${c.red('already in use? ')}` +
                     `${c.red('Run "lsof -i" in your terminal to check.\n')}`,
    }

    return this._format(kinds[kind])
  }
}

module.exports = {
  AppUI: AppUI,
  UI: UI
};
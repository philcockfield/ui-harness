import { expect } from 'chai';
import { log } from '.';



describe('Client: logging to console (NB: Tests hidden because this mucks with the console)', function() {
  let items: any[];
  let fnLog: any;
  beforeEach(() => {
    fnLog = console.log;
    items = [];
    console.log = (...value: any[]) => items.push(value);
  });
  afterEach(() => {
    console.log = fnLog;
    log.silent = false;
  });



  it('logs a single value', () => {
    log.info('info');
    log.warn('warn');
    log.error('error');
    log.DEBUG('DEBUG');
    expect(items[0]).to.eql(['info']);
    expect(items[1]).to.eql(['warn']);
    expect(items[2][0]).to.contain('error');
    expect(items[3]).to.eql(['DEBUG']);
  });


  it('logs multiple parameter values', () => {
    log.info('my', 'info');
    log.warn('my', 'warn');
    log.error('my', 'error');

    expect(items[0]).to.eql(['my', 'info']);
    expect(items[1]).to.eql(['my', 'warn']);
    expect(items[2]).to.eql(['my', 'error']);
  });



  it('is not silent by default', () => {
    expect(log.silent).to.equal(false);
  });


  it('does not log when silent', () => {
    log.silent = true;
    log.info(1);
    log.warn(2);
    log.error(3);
    expect(items).to.eql([]);
  });
});

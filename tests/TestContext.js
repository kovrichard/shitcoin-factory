const Context = artifacts.require('Context');

contract('Context', () => {
  it('Should be abstract', () => {
    expect(Context.new).to.throw(Error);
  });
});

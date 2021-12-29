const Ownable = artifacts.require('Ownable');

contract('Ownable', () => {
  it('Should be abstract', () => {
    expect(Ownable.new).to.throw(Error);
  });
});

import { createTest, destroyVM } from '../util';
import DomobAlert from 'packages/domob-alert';

describe('DomobAlert', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(DomobAlert, true);
    expect(vm.$el).to.exist;
  });
});


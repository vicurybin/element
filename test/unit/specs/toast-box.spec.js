import { createTest, destroyVM } from '../util';
import ToastBox from 'packages/toast-box';

describe('ToastBox', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(ToastBox, true);
    expect(vm.$el).to.exist;
  });
});


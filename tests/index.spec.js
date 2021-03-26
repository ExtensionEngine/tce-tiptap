import { Editor } from '../src';
import { mount } from '@vue/test-utils';

describe('TceTiptap', () => {
  it('It should pass', () => {
    const wrapper = mount(Editor, {
      propsData: {}
    });
    expect(wrapper).toBeTruthy();
  });
});

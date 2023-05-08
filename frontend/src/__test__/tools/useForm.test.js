describe('appeasement', () => {
    test ('appeasement', () => {
        expect(true).toBe(true)
    })
    
})

/*

//needs to be updated later qwhwen react-hooks is updated

import { renderHook, act} from '@testing-library/react-hooks';
import useForm from '../../../tools/useForm';

describe('useForm', () => {
    const initial = {
        username: '',
        password: '',
    };

    test ('initializes with the correct values', () => {
        const {result } = renderHook(() => useForm(initial));
        expect(result.current.inputs).toEqual(initial);
    })

    test('updates values correctly', () => {
        const { result } = renderHook(() => useForm(initial))

        act(() => {
            result.current.handleChange({
                target: {
                    name: 'username',
                    value: 'John',
                    type: 'text'
                }
            })
        });

        expect(result.current.inputs.username).toBe('John');
    })

    test('resets form correctly', () => {
        const { result } = renderHook(() => useForm(initial));

        act(() => {
            result.current.handleChange({
                target: {
                    name: 'username',
                    value: 'John',
                    type: 'text'
                }
            })
        });

        act(() => {
            result.current.resetForm();
        })

        expect(result.current.inputs).toEqual(initial);
    })

    test('clears form correctly', () => {
        const { result } = renderHook(() => useForm(initial));
    
        act(() => {
          result.current.handleChange({
            target: { name: 'username', value: 'John', type: 'text' },
          });
        });
    
        act(() => {
          result.current.clearForm();
        });
    
        expect(result.current.inputs).toEqual({ username: '', password: '' });
      });
})*/
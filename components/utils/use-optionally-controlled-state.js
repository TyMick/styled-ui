import { useCallback, useState } from 'react';

/**
 * For situations when a value can be controlled externally via props, but if it isn't controlled
 * you'd like to control it internally via state.
 * @param {any} controlledValue - The prop that can externally control the value when defined.
 * @param {(newValue: any, ...args: any[]) => void} onChange - The prop that can externally control the value when
 * defined.
 * @param {any} defaultValue - An optional default value to initialize the state with when the value
 * is not externally controlled.
 * @returns {[value: any, innerOnChange: (newValue?: any, ...onChangeArgs: any[]) => void]} An array of the state value
 * and either a setter function or (if the value is externally controlled) an empty function.
 */
export function useOptionallyControlledState(controlledValue, onChange, defaultValue) {
	const isControlled = controlledValue !== undefined;
	const [value, setValue] = useState(defaultValue);

	const innerOnChange = useCallback(
		(newValue, ...onChangeArgs) => {
			if (!isControlled) {
				setValue(newValue);
			}
			if (onChange) {
				onChange(newValue, ...onChangeArgs);
			}
		},
		[isControlled, onChange],
	);

	return [isControlled ? controlledValue : value, innerOnChange];
}

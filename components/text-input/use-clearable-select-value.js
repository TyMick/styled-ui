import { useCallback } from 'react';
import { useOptionallyControlledState } from '../utils/use-optionally-controlled-state';

/**
 * A React Select workaround to clear the `Select` value when the user is typing into the `Select`'s
 * input (as long as the `Select` is only for a single value and is clearable).
 */
export function useSelectValues({
	value: controlledSelectValue,
	onChange: onSelectChange,
	defaultValue: defaultSelectValue,
	inputValue: controlledInputValue,
	onInputChange,
	defaultInputValue,
	isClearable,
	isMulti,
	shouldRenderValueInInput,
}) {
	const [selectValue, localOnSelectChange] = useOptionallyControlledState(
		controlledSelectValue,
		onSelectChange,
		defaultSelectValue,
	);
	const selectLabel = selectValue?.label;
	const [inputValue, localOnInputChange] = useOptionallyControlledState(
		controlledInputValue,
		onInputChange,
		defaultInputValue !== undefined ? defaultInputValue : selectValue?.label,
	);

	const innerOnSelectChange = useCallback(
		(newSelectValue, meta) => {
			localOnSelectChange(newSelectValue, meta);

			if (shouldRenderValueInInput) {
				localOnInputChange(newSelectValue?.label, { action: 'set-value' });
			}
		},
		[localOnInputChange, localOnSelectChange, shouldRenderValueInInput],
	);
	const innerOnInputChange = useCallback(
		(newInputValue, meta) => {
			const userIsTyping = meta.action === 'input-change';
			if (isClearable && !isMulti && userIsTyping) {
				/** @todo Determine if this is a breaking change */
				localOnSelectChange(null, { action: 'clear' });
			}

			// The inner 'set-value' action is always accompanied by newInputValue = '' (see https://github.com/JedWatson/react-select/blob/react-select@3.2.0/packages/react-select/src/Select.js#L644)
			if (shouldRenderValueInInput && meta.action !== 'input-change') {
				localOnInputChange(selectLabel, meta);
			} else {
				localOnInputChange(newInputValue, meta);
			}
		},
		[
			isClearable,
			isMulti,
			localOnInputChange,
			localOnSelectChange,
			selectLabel,
			shouldRenderValueInInput,
		],
	);

	return {
		innerValue: selectValue,
		innerOnChange: innerOnSelectChange,
		innerInputValue: inputValue,
		innerOnInputChange,
	};
}

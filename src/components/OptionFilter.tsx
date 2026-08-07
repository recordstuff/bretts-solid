import { FormControl, InputLabel, MenuItem, Select } from '@suid/material';
import { NameValuePair } from '../models/NameValuePair';
import { createUniqueId } from 'solid-js';
import type { Accessor, JSX, Setter } from 'solid-js';
import { SelectChangeEvent } from '@suid/material/Select';

export interface Props<T> {
    label: string,
    options: NameValuePair<T>[],
    setSelectedValue: Setter<T>,
    selectedValue: Accessor<T>,
}

function OptionFilter<T>({ options, label, setSelectedValue, selectedValue }: Props<T>): JSX.Element {
    const labelId = createUniqueId();

    const handleChange = (event: SelectChangeEvent<T>) => {
        setSelectedValue(() => event.target.value)
    }

    return (
        <FormControl fullWidth>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                label={label}
                onChange={handleChange}
                value={`${selectedValue()}`}
            >
                {options.map(row => (
                    <MenuItem value={`${row.Value}`}>{row.Name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default OptionFilter

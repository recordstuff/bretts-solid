import { TextField } from '@suid/material';
import { Accessor, Setter } from 'solid-js/types/reactive/signal';
import { Component } from 'solid-js';

export interface Props {
    label: string
    searchText: Accessor<string>
    setSearchText: Setter<string>
}

const TextFilter: Component<Props> = ({ label, searchText, setSearchText }) => {

    const handleChange = (event: any) => {
        setSearchText(event.target.value);
    }

    return (
        <TextField
            fullWidth
            label={label}
            value={searchText()}
            onChange={handleChange}
        />
    )
}

export default TextFilter
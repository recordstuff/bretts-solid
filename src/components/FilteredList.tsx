import { Box, List, ListItemButton } from '@suid/material';
import TextFilter from './TextFilter';
import { NameGuidPair } from '../models/NameGuidPair';
import { Accessor, Component, createSignal } from 'solid-js';

export interface Props {
    label: string
    items: Accessor<NameGuidPair[]>
    handleClick: (event: MouseEvent) => void
}

const FilteredList: Component<Props> = ({ label, items, handleClick }) => {
    const [searchText, setSearchText] = createSignal('')

    return (
        <Box>
            <TextFilter
                label={`Filter ${label}`}
                searchText={searchText}
                setSearchText={setSearchText}
            />
            <List>
                {items().map((item) => (
                    (searchText().length === 0 || item.Name.toLowerCase().includes(searchText().toLowerCase()))
                    && <ListItemButton
                        onClick={handleClick}>
                        {item.Name}
                    </ListItemButton>))}
            </List>
        </Box>
    )
}

export default FilteredList
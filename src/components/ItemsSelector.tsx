import { NameGuidPair } from '../models/NameGuidPair';
import FilteredList from './FilteredList';
import { Box, Button, Grid, Stack, Typography } from '@suid/material';
import { Accessor, Component, Setter, createMemo } from 'solid-js';

export interface Props {
    allItems: Accessor<NameGuidPair[]>
    label: string
    selected: Accessor<NameGuidPair[]>
    setSelected: Setter<NameGuidPair[]>,
}

const ItemsSelector: Component<Props> = ({ allItems, label, selected, setSelected }) => {

    const handleClickSelect = (event: MouseEvent): void => {
        const clickedName = (event.currentTarget as HTMLElement).textContent
        const clicked = available().find(s => s.Name === clickedName)

        if (clicked === undefined) return
        
        setSelected([...selected(), clicked]
            .sort((a, b) => a.Name.localeCompare(b.Name)))
    }

    const handleClickDeselect = (event: MouseEvent): void => {
        const clickedName = (event.currentTarget as HTMLElement).textContent
        setSelected(selected().filter(s => s.Name !== clickedName))
    }

    const handleClickSelectAll = (): void => {
        setSelected(allItems);
    }

    const handleClickDeselectAll = (): void => {
        setSelected([]);
    }

    const available = createMemo(() => {
        return allItems()
            .filter(ai => !selected().some(s => s.Guid === ai.Guid))
            .sort((a, b) => a.Name.localeCompare(b.Name))        
    })

    return (
        <Box>
            <Typography paddingTop={1} paddingBottom={.5}>{label}</Typography>
            <Grid container direction='row'>
                <Grid item sm={12} md={5}>
                    <FilteredList
                        label='Selected'
                        items={selected}
                        handleClick={handleClickDeselect}
                    />
                </Grid>
                <Grid item sm={12} md={2}>
                    <Stack spacing={2} padding={2}>
                        <Button onClick={handleClickSelectAll} variant='outlined'>{'<<'}</Button>
                        <Button onClick={handleClickDeselectAll} variant='outlined'>{'>>'}</Button>
                    </Stack>
                </Grid>
                <Grid item sm={12} md={5}>
                    <FilteredList
                        label='Available'
                        items={available}
                        handleClick={handleClickSelect}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ItemsSelector
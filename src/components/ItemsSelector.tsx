import { NameGuidPair } from '../models/NameGuidPair';
import FilteredList from './FilteredList';
import { Box, Button, Grid, Stack, Typography } from '@suid/material';
import { Accessor, Component, Setter, createSignal, onMount } from 'solid-js';

export interface Props {
    allItems: Accessor<NameGuidPair[]>
    initiallySelectedItems: NameGuidPair[]
    label: string
    selected: Accessor<NameGuidPair[]>
    setSelected: Setter<NameGuidPair[]>,
}

const ItemsSelector: Component<Props> = ({ allItems, initiallySelectedItems, label, selected, setSelected }) => {

    const [available, setAvailable] = createSignal<NameGuidPair[]>([])

    const handleClick = (event: MouseEvent, source: Accessor<NameGuidPair[]>, setSource: Setter<NameGuidPair[]>, destination: Accessor<NameGuidPair[]>, setDestination: Setter<NameGuidPair[]>): void => {
        const clickedName = (event.currentTarget as HTMLElement).textContent
        const clicked = source().find(s => s.Name === clickedName)

        if (clicked === undefined) return

        setSource(source().filter(s => s.Name !== clickedName))
        setDestination([...destination(), clicked]
            .sort((a, b) => a.Name.localeCompare(b.Name)))
    }

    const handleClickSelect = (event: MouseEvent): void => {
        handleClick(event, available, setAvailable, selected, setSelected)
    }

    const handleClickDeselect = (event: MouseEvent): void => {
        handleClick(event, selected, setSelected, available, setAvailable)
    }

    const handleClickSelectAll = (): void => {
        setAvailable([])
        setSelected(allItems);
    }

    const handleClickDeselectAll = (): void => {
        setSelected([]);
        setAvailable(allItems)
    }

    onMount(() => {
        setSelected(initiallySelectedItems)
        setAvailable(allItems().filter(ai => !initiallySelectedItems.some(isi => isi.Guid === ai.Guid)))
    })

    return (
        <Box>
            <Typography paddingTop={1} paddingBottom={.5}>{label}</Typography>
            <Grid container direction='row'>
                <Grid item sm={12} md={5}>
                    <FilteredList
                        label='Selected'
                        items={selected()}
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
                        items={available()}
                        handleClick={handleClickSelect}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ItemsSelector
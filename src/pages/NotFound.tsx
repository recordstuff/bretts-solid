import { Component } from "solid-js"
import { Grid, Typography } from "@suid/material"

const NotFound: Component = () => {
  return (
    <Grid item margin={4}>
      <Typography variant="h5">404 Error</Typography>
      <p>The page was not found.</p>
    </Grid>
  )
}

export default NotFound
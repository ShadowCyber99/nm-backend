import React, { useState } from "react";
import { Button, CssBaseline, Grid, Stack } from "@mui/material";
import Sidebar from "../../components/sidebar";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import TopTab from "../../components/top-tab";
import CurrentUnits from "./current";
import PastUnits from "./past";
import AddUnit from "./add";
import { strictValidObjectWithKeys } from "../../utils/common-utils";
import WindowTitle from "../../components/window-name";
import Clock from "../../components/clock";
import { tablePadding } from "../../assets/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    height: '94vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  mainRoot: {
    width: '100vw',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const UnitManagement = () => {
  const [value, setValue] = useState(1);
  const classes = useStyles();
  const [data, setUnitData] = useState({});

  const handleChange = (event, newValue) => {
    if (newValue === 3) {
      setValue(newValue);
    } else {
      setUnitData({});
      setValue(newValue);
    }
  };

  const clearDataToDeault = () => {
    setValue(3);
    setUnitData({});
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Unit Management" />
      <CssBaseline />
      <Sidebar onChange={() => setValue(1)} />
      <main className={classes.mainRoot}>
        <Grid item>
          <TabContext value={value}>
            <Box
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
              className={classes.tabStyle}
              flexDirection={'row'}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <TopTab
                  label="Units Management"
                  value={1}
                  ids="unit_management"
                />
                <TopTab label="Past Units" value={2} ids="unit_past_units" />
                <TopTab
                  ids={
                    strictValidObjectWithKeys(data) ? 'unit_edit' : 'unit_add'
                  }
                  label={
                    strictValidObjectWithKeys(data) ? 'Edit Unit' : 'Add Unit'
                  }
                  value={3}
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    id="unit_tab_add_unit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    onClick={() => clearDataToDeault()}
                    disabled={value === 3}
                  >
                    Add Unit
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={1} index={1}>
                <CurrentUnits
                  setData={(a) => setUnitData(a)}
                  setValue={(e) => setValue(e)}
                />
              </TabPanel>
              <TabPanel sx={tablePadding} value={2}>
                <PastUnits
                  setData={(a) => setUnitData(a)}
                  setValue={(e) => setValue(e)}
                />
              </TabPanel>
              <TabPanel value={3}>
                <AddUnit
                  unitData={data}
                  setValue={() => {
                    setValue(1);
                    setUnitData({});
                  }}
                />
              </TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
    </div>
  );
};

export default UnitManagement;

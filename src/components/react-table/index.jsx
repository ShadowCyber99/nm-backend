/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useFlexLayout,
} from 'react-table';
import { styled } from '@mui/system';
import {
  Skeleton,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  Table,
  TableContainer,
  Paper,
  Button,
  Box,
  TextField,
} from '@mui/material';
import {
  DefaultColumnFilter,
  DownloadExcel,
  GlobalFilter,
  SelectColumnFilter,
} from './helper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import EmptyContainer from '../empty-container';
import {
  formatDate,
  strictValidArrayWithLength,
  strictValidString,
} from '../../utils/common-utils';
import useBreakpoints from '../../hooks/useWindowDimensions';
import { makeStyles } from '@mui/styles';
import { useSticky } from 'react-table-sticky';
import newStyled from 'styled-components';
import generateExcel from 'zipcelx';
import { size } from 'lodash';
import moment from 'moment/moment';
import { LoadingButton } from '@mui/lab';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRef } from 'react';
import { ExportIcon } from '../../assets/icons';

const Styles = newStyled.div`
  .table {
    border: 1px solid #ddd;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;

const StyledTableCell = styled(TableCell)(({ theme, right, increase }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: '#1C2A39',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    // fontSize: 40,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    padding: theme.spacing(1, 2),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    color: '#5C6878',
    fontStyle: 'normal',
    fontWeight: 'normal',
    wordWrap: 'break-word',
    maxHeight: increase ? 65 : 50,
    // maxHeight: 65,
    minHeight: 35,
    overflow: 'hidden',
    textAlign: right ? 'right' : 'left',
  },
}));

const StyledheaderTableCell = styled(TableCell)(({ theme, increase }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: '#1C2A39',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    // fontSize: 40,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: increase ? 20 : 14,
    padding: theme.spacing(0.5, 2),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    color: '#5C6878',
    fontStyle: 'normal',
    fontWeight: 'normal',
    wordWrap: 'break-word',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
}));
const useStyles = makeStyles({
  customTableContainer: {
    overflowX: 'auto',
  },
  head: {
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
  },
  input: {
    width: '10%',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  button: {
    width: '10%',
  },
  errorText: {
    fontWeight: 500,
    fontSize: 18,
    color: '#fff',
  },
});
const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: selected ? 'rgb(206, 237, 253)' : 'rgba(250, 250, 250, 1)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: selected ? 'rgb(206, 237, 253)' : 'rgba(255, 255, 255, 1)',
  },
  // hide last border
  ' &:last-child th': {
    border: 0,
  },
}));
// Define a default UI for filtering
const defaultPropGetter = () => ({});
const ReactTable = ({
  columnDefs,
  rowData,
  total,
  setRecordsPerPage = defaultPropGetter,
  serverSidePagination = false,
  recordsPerPage,
  pageNumber,
  changePageSize,
  changePageIndex,
  loading,
  customText,
  isLoadInner,
  filterButtonName = 'Filter',
  height,
  filterButton = true,
  pagination = true,
  sxTable = {},
  showExport = false,
  stickyHeader = true,
  selected,
  sxEmptyStyle,
  downloadBtnBody = {},
  isDateFilter = false,
  isQuote = false,
  headerFilter = true,
  globalFilterShow = true,
  customHeight = false,
  fontSizeLg = false,
  clearFilters = false,
  tableSize = false,
  onClearFilter,
  onFilter,
  onQuote,
  setClearFilters = defaultPropGetter,
  getCellProperties = defaultPropGetter,
  hiddenColumns = [],
  excelName = 'Excel List',
  rightAlign = false,
  serverSideFilter = defaultPropGetter,
  clearFilterButton = defaultPropGetter,
  isAccountUser = false,
  DateFilterCss = false,
}) => {
  const point = useBreakpoints();
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([15, 30, 60]);
  const currentFilterDates = useRef({ start_date: null, end_date: null });
  const [dates, setDates] = useState({ start_date: null, end_date: null });
  const [clearFilter, setClearFilter] = useState(!filterButton || false);
  const [filterText, setFilterText] = useState('');
  const [fixedHeight, setHeight] = useState(
    height || { maxHeight: 650, minHeight: 650 },
  );
  const classes = useStyles();
  const tableData = React.useMemo(
    () => (loading ? Array(20).fill({}) : rowData),
    [loading, rowData],
  );
  const tableColumns = React.useMemo(
    () =>
      loading
        ? columnDefs.map((column) => ({
            ...column,
            Cell: <Skeleton sx={{ my: 0.5 }} />,
          }))
        : columnDefs,
    [loading, columnDefs],
  );
  function getHeader(column) {
    if (size(column) === 1) {
      return [
        {
          value: column.Header,
          type: 'string',
        },
      ];
    } else {
      return [
        {
          value: column.Header,
          type: 'string',
        },
      ];
    }
  }

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      SelectFilter: SelectColumnFilter,
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 200, // width is used for both the flex-basis and flex-grow
      maxWidth: 800,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // state: {globalFilter },
    state: { pageIndex, pageSize, globalFilter },
    setPageSize,
    gotoPage,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    setAllFilters,
    allColumns,
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      defaultColumn, // Be sure to pass the defaultColumn option
      autoResetGlobalFilter: false,
      autoResetPage: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useResizeColumns,
    useFlexLayout,
    useSticky,
  );
  function getExcel() {
    const getExcelName = `${excelName} ${moment().format(
      'MM-DD-YYYY HH:mm:ss',
    )}`;
    // let excelName = `Payment List ${moment().format('MM-DD-YYYY HH:mm:ss')} `;
    const config = {
      filename: getExcelName,
      sheet: {
        data: [],
      },
    };

    const dataSet = config.sheet.data;

    // review with one level nested config
    // HEADERS
    headerGroups.forEach((headerGroup) => {
      const headerRow = [];
      if (headerGroup.headers) {
        columnDefs.forEach((column) => {
          if (column.Header !== 'Actions' && column.Header !== 'Action')
            headerRow.push(...getHeader(column));
        });
      }

      dataSet.push(headerRow);
    });

    // FILTERED ROWS
    if (rows.length > 0) {
      rows.forEach((row) => {
        const dataRow = [];

        Object.values(row.values).forEach((value) => {
          return dataRow.push({
            value,
            type: typeof value === 'number' ? 'number' : 'string',
          });
        });

        dataSet.push(dataRow);
      });
    } else {
      dataSet.push([
        {
          value: 'No data',
          type: 'string',
        },
      ]);
    }

    return generateExcel(config);
  }

  useEffect(() => {
    // const array2 = ['distance', 'pick_up_stairs'];
    allColumns.map((column) => {
      const val = hiddenColumns.includes(column.id);
      if (val) {
        return column.toggleHidden();
      } else {
        return null;
      }
    });
  }, [allColumns, hiddenColumns]);

  const handleChangePage = (event, newPage) => {
    if (serverSidePagination) {
      changePageIndex(newPage);
    }
    gotoPage(newPage);
  };

  const setPaginationSize = () => {
    if (customHeight === false && tableSize === false) {
      if (point === 'xs') {
        setPageSize(7);
        setRecordsPerPage(7);
        setRowsPerPageOptions([7, 20, 30]);
        setHeight({ maxHeight: '83vh', minHeight: '83vh' });
      } else if (point === 'sm') {
        setPageSize(7);
        setRecordsPerPage(7);
        setRowsPerPageOptions([7, 20, 30]);
        setHeight({ maxHeight: '83vh', minHeight: '83vh' });
      } else if (point === 'md') {
        setPageSize(10);
        setRecordsPerPage(10);
        setRowsPerPageOptions([10, 20, 30]);
        setHeight({ maxHeight: '83vh', minHeight: '83vh' });
      } else if (point === 'lg') {
        setHeight({ maxHeight: '74vh', minHeight: '68vh' });
        setRecordsPerPage(10);
        setPageSize(10);
        setRowsPerPageOptions([10, 20, 30]);
      } else if (point === 'lgg') {
        if (DateFilterCss) {
          setHeight({ maxHeight: '73vh', minHeight: '73vh' });
        } else {
          setHeight({ maxHeight: '77vh', minHeight: '76vh' });
        }
        setRecordsPerPage(10);
        setPageSize(10);
        setRowsPerPageOptions([10, 20, 30]);
      } else if (point === 'xlg') {
        if (DateFilterCss) {
          setHeight({ maxHeight: '75vh', minHeight: '75vh' });
        } else {
          setHeight({ maxHeight: '78vh', minHeight: '78vh' });
        }

        setPageSize(15);
        setRecordsPerPage(15);
        setRowsPerPageOptions([15, 30, 40]);
      } else if (point === 'xlgg') {
        if (DateFilterCss) {
          setHeight({ maxHeight: '76vh', minHeight: '76vh' });
        } else {
          setHeight({ maxHeight: '78vh', minHeight: '78vh' });
        }
        setPageSize(17);
        setRecordsPerPage(17);
        setRowsPerPageOptions([17, 30, 40]);
      } else if (point === 'xxlg') {
        if (DateFilterCss) {
          setHeight({ maxHeight: '79vh', minHeight: '79vh' });
        } else {
          setHeight({ maxHeight: '80vh', minHeight: '80vh' });
        }
        setPageSize(20);
        setRecordsPerPage(20);
        setRowsPerPageOptions([20, 30, 40]);
      } else if (point === 'xxlgg') {
        if (DateFilterCss) {
          setHeight({ maxHeight: '81vh', minHeight: '81vh' });
        } else {
          setHeight({ maxHeight: '83vh', minHeight: '83vh' });
        }
        setPageSize(30);
        setRecordsPerPage(30);
        setRowsPerPageOptions([20, 30, 40]);
      } else if (point === 'xxxlg') {
        setHeight({ maxHeight: '85vh', minHeight: '85vh' });
        setPageSize(30);
        setRecordsPerPage(30);
        setRowsPerPageOptions([20, 30, 40]);
      } else {
        setHeight({ maxHeight: '77vh', minHeight: '76vh' });
        setRecordsPerPage(17);
        setPageSize(17);
        setRowsPerPageOptions([17, 20, 30]);
      }
    }
  };
  useEffect(() => {
    if (clearFilters) {
      setAllFilters([]);
      setGlobalFilter('');
      setTimeout(() => {
        setClearFilters();
      }, 2000);
    }
  }, [clearFilters]);

  useEffect(() => {
    if (loading) {
      gotoPage(0);
    }
  }, [loading]);

  useEffect(() => {
    setPaginationSize();
  }, [point]);

  useEffect(() => {
    if (!pagination && strictValidArrayWithLength(rowData)) {
      setPageSize(rowData.length);
    } else {
      // setPaginationSize();
    }
  }, [pagination, rowData]);

  const handleChangeRowsPerPage = (event) => {
    if (serverSidePagination) {
      setPageSize(event.target.value);
      changePageSize(event.target.value);
    } else {
      setPageSize(event.target.value);
    }
  };
  const onFilterClick = () => {
    if (
      currentFilterDates.current.start_date !== null &&
      currentFilterDates.current.end_date !== null
    ) {
      onFilter(currentFilterDates.current);
      setClearFilter(true);
    }
  };

  const onQuotation = () => {
    onQuote();
  };
  const DateFilterView = (updateVal, value, label) => {
    const handleChange = (newValue) => {
      if (newValue === null) {
        currentFilterDates.current[updateVal] = null;
      } else {
        const d = formatDate(newValue);
        currentFilterDates.current[updateVal] = d;
        setDates((prevState) => ({
          ...prevState,
          [updateVal]: d,
        }));
        if (serverSidePagination) {
          onFilter(currentFilterDates.current);
        }
        if (headerFilter || !filterButton) {
          onFilterClick();
          setClearFilter(true);
        } else {
          currentFilterDates.current.end_date = currentFilterDates.current
            .end_date
            ? currentFilterDates.current.end_date
            : moment().format('MM-DD-YYYY');
          setDates((prevState) => ({
            ...prevState,
            end_date: currentFilterDates.current.end_date,
          }));
          setClearFilter(false);
        }
      }
    };
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          size="small"
          label={label}
          value={value}
          closeOnSelect
          componentsProps={{
            actionBar: {
              actions: ['cancel', ''],
            },
          }}
          onChange={() => {}}
          onAccept={(w) => handleChange(w)}
          showToolbar={false}
          DialogProps={{}}
          minDate={
            updateVal === 'end_date'
              ? new Date(currentFilterDates.current.start_date)
              : new Date('01/01/1990')
          }
          maxDate={
            updateVal === 'start_date' &&
            strictValidString(currentFilterDates.current.end_date)
              ? new Date(currentFilterDates.current.end_date)
              : null
          }
          inputFormat="MM/dd/yy"
          renderInput={(params) => (
            <TextField
              style={{ width: 200 }}
              sx={{ mr: 2, backgroundColor: '#FAFAFA' }}
              className={classes.input}
              size="small"
              {...params}
            />
          )}
        />
      </LocalizationProvider>
      // <LocalizationProvider dateAdapter={AdapterDateFns}>
      //   <DatePicker
      //     size="small"
      //     label={label}
      //     value={value}
      //     showToolbar={false}
      //     minDate={
      //       updateVal === 'end_date'
      //         ? new Date(currentFilterDates.current.start_date)
      //         : new Date('01/01/1990')
      //     }
      //     onChange={() => {}}
      //     onAccept={(w) => handleChange(w)}
      //     renderInput={(params) => (
      //       <TextField
      //         className={classes.input}
      //         style={{ width: 200 }}
      //         sx={{ mr: 2 }}
      //         size="small"
      //         {...params}
      //       />
      //     )}
      //   />
      // </LocalizationProvider>
    );
  };
  const onClickClear = () => {
    currentFilterDates.current = {
      start_date: null,
      end_date: null,
    };
    setDates({
      start_date: null,
      end_date: null,
    });
    onClearFilter();
    setAllFilters([]);
    setGlobalFilter('');
    // setClearFilter(false);
  };

  if (isLoadInner && !strictValidArrayWithLength(rowData)) {
    return (
      <>
        <Box
          flexDirection="row"
          display="flex"
          alignSelf="flex-end"
          flexGrow={1}
          style={{ width: '100%', marginTop: '8px', maxHeight: '60px' }}
          justifyContent={isAccountUser ? 'flex-end' : 'space-between'}
        >
          {isDateFilter && (
            <div>
              {DateFilterView('start_date', dates.start_date, 'Start Date')}
              {DateFilterView('end_date', dates.end_date, 'End Date')}

              <Button
                size="medium"
                style={{ width: 200 }}
                variant="contained"
                onClick={() => {
                  clearFilter ? onClickClear() : onFilterClick();
                }}
                color="primary"
                // startIcon={<AddIcon />}
                className={classes.button}
                // disabled={value === "2"}
              >
                {clearFilter ? `Clear ${filterButtonName}` : filterButtonName}
              </Button>
            </div>
          )}
          {isQuote && (
            <div>
              <Button
                size="medium"
                style={{
                  width: 200,
                  marginRight: 5,
                  textTransform: 'capitalize',
                }}
                variant="contained"
                onClick={() => onQuotation()}
                color="primary"
                autoCapitalize={true}
                className={classes.button}
              >
                QUOTATION
              </Button>
            </div>
          )}
        </Box>
        {/* {isDateFilter && (
          <Box mt={2}>
            {DateFilterView('start_date', dates.start_date, 'Start Date')}
            {DateFilterView('end_date', dates.end_date, 'End Date')}

            <Button
              size="medium"
              style={{ width: 200 }}
              variant="contained"
              onClick={() => {
                clearFilter ? onClickClear() : onFilterClick();
              }}
              color="primary"
              // startIcon={<AddIcon />}
              className={classes.button}
              // disabled={value === "2"}
            >
              {clearFilter ? `Clear ${filterButtonName}` : filterButtonName}
            </Button>
          </Box>
        )}
        {isQuote && (
          <Button
            size="medium"
            style={{ width: 200, marginRight: 5, textTransform: 'capitalize' }}
            variant="contained"
            onClick={() => onQuotation()}
            color="primary"
            // startIcon={<AddIcon />}
            className={classes.button}
            // disabled={value === "2"}
          >
            Quotation
          </Button>
        )} */}
        {globalFilterShow && serverSidePagination && (
          <div style={{ float: 'left', width: '50%' }}>
            <GlobalFilter
              filterText={filterText}
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              setPageSize={() => gotoPage(0)}
              serverSidePagination={serverSidePagination}
              // serverSidefilter={serverSideFilter}
              filterValues={(e) => {
                serverSideFilter(e);
                setFilterText(e);
              }}
              ClearButton={() => {
                setAllFilters([]);
                clearFilterButton();
                setFilterText('');
              }}
              disabled={loading}
            />
          </div>
        )}
        <EmptyContainer
          sx={sxEmptyStyle}
          text={customText || 'No data found'}
        />
      </>
    );
  }

  return (
    <Styles>
      <Box
        flexDirection="row"
        display="flex"
        flexGrow={1}
        style={{ width: '100%', marginTop: '8px', maxHeight: '60px' }}
        justifyContent={isAccountUser ? 'flex-end' : 'space-between'}
      >
        {isDateFilter && (
          <div>
            {DateFilterView('start_date', dates.start_date, 'Start Date')}
            {DateFilterView('end_date', dates.end_date, 'End Date')}

            <Button
              size="medium"
              style={{ width: 200 }}
              variant="contained"
              onClick={() => {
                clearFilter ? onClickClear() : onFilterClick();
              }}
              color="primary"
              // startIcon={<AddIcon />}
              className={classes.button}
              // disabled={value === "2"}
            >
              {clearFilter ? `Clear ${filterButtonName}` : filterButtonName}
            </Button>
          </div>
        )}
        {isQuote && (
          <div>
            <Button
              size="medium"
              style={{
                width: 200,
                marginRight: 5,
                textTransform: 'capitalize',
              }}
              variant="contained"
              onClick={() => onQuotation()}
              color="primary"
              autoCapitalize={true}
              className={classes.button}
            >
              QUOTATION
            </Button>
          </div>
        )}
      </Box>
      <Box
        // my={2}
        flexDirection="row"
        display="flex"
        flexGrow={1}
        style={{ width: '100%', marginTop: '5px', maxHeight: '60px' }}
        justifyContent="space-between"
      >
        {globalFilterShow && (
          <div style={{ float: 'left', width: '50%' }}>
            <GlobalFilter
              filterText={filterText}
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              setPageSize={() => gotoPage(0)}
              serverSidePagination={serverSidePagination}
              // serverSidefilter={serverSideFilter}
              filterValues={(e) => {
                serverSideFilter(e);
                setFilterText(e);
              }}
              ClearButton={() => {
                setAllFilters([]);
                clearFilterButton();
                setFilterText('');
              }}
              disabled={loading}
            />
          </div>
        )}
        {strictValidArrayWithLength(rowData) &&
          showExport &&
          (serverSidePagination ? (
            <DownloadExcel body={downloadBtnBody} />
          ) : (
            <LoadingButton
              size="medium"
              loading={loading}
              variant="contained"
              onClick={getExcel}
              disabled={!strictValidArrayWithLength(rowData)}
              color="primary"
              startIcon={<ExportIcon />}
              // startIcon={<CheckIcon />}
              style={{
                maxHeight: '37px',
                marginRight: '7px',
                marginTop: 16,
                textTransform: 'capitalize',
              }}
            >
              {'Export Excel'}
            </LoadingButton>
          ))}
      </Box>

      <Paper
        className="uniqueName"
        sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}
      >
        <TableContainer
          sx={fixedHeight}
          classes={{ root: classes.customTableContainer }}
        >
          <Table
            size="small"
            {...getTableProps()}
            stickyHeader={stickyHeader}
            aria-label="sticky table"
          >
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <StyledheaderTableCell
                      increase={fontSizeLg}
                      className={classes.head}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDownwardIcon
                              sx={{
                                fontSize: 16,
                              }}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              sx={{
                                fontSize: 16,
                              }}
                            />
                          )
                        ) : null}
                      </span>
                    </StyledheaderTableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            {headerFilter && (
              <TableHead>
                <TableRow>
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <StyledTableCell {...column.getHeaderProps()}>
                          <div>
                            {column.canFilter ? column.render('Filter') : null}
                          </div>
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableRow>
              </TableHead>
            )}
            {strictValidArrayWithLength(page) ? (
              <TableBody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <StyledTableRow
                      hover={true}
                      selected={row.id === selected}
                      {...row.getRowProps(row)}
                    >
                      {row.cells.map((cell, index) => {
                        return (
                          <StyledTableCell
                            right={cell.column.rightAlign || false}
                            increase={cell.column.increase || false}
                            {...cell.getCellProps([
                              {
                                className: cell.column.className,
                                style: cell.column.style,
                              },
                              getCellProperties(cell, index),
                            ])}
                          >
                            {cell.render('Cell')}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            ) : (
              <EmptyContainer
                design={false}
                text={customText || 'No Data found'}
              />
            )}
          </Table>
        </TableContainer>
        {pagination && serverSidePagination ? (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={total}
            page={pageNumber}
            onPageChange={handleChangePage}
            rowsPerPage={recordsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
          />
        ) : (
          pagination && (
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={rows.length}
              page={pageIndex}
              onPageChange={handleChangePage}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showFirstButton
              showLastButton
            />
          )
        )}
      </Paper>
    </Styles>
  );
};

export default ReactTable;
// export default ReactTable;

// import makeData from './data';

// /* eslint-disable react-hooks/exhaustive-deps */
// import React from 'react';
// import {
//   useTable,
//   useSortBy,
//   useFilters,
//   useGlobalFilter,
//   usePagination,
//   useResizeColumns,
//   useFlexLayout,
// } from 'react-table';
// import { styled } from '@mui/system';
// import {
//   Skeleton,
//   TableBody,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Table,
//   TableContainer,
//   Paper,
//   TextField,
// } from '@mui/material';
// // import {
// //   DefaultColumnFilter,
// //   GlobalFilter,
// //   SelectColumnFilter,
// // } from './helper';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import EmptyContainer from '../empty-container';
// import { strictValidArrayWithLength } from '../../utils/common-utils';
// import useBreakpoints from '../../hooks/useWindowDimensions';
// import { makeStyles } from '@mui/styles';
// import { useSticky } from 'react-table-sticky';
// import styledComponents from 'styled-components';

// const Styles = styledComponents.div`
// .inputedit {
//   font-size: 1rem;
//   padding: 0;
//   margin: 0;
//   border: 0;
//   background:#000,
//  }
// `;

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     color: '#1C2A39',
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//     // fontSize: 40,
//     fontFamily: 'Roboto',
//     fontStyle: 'normal',
//     fontWeight: 500,
//     fontSize: 14,
//     padding: theme.spacing(1, 2),
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//     color: '#5C6878',
//     fontStyle: 'normal',
//     fontWeight: 'normal',
//     wordWrap: 'break-word',
//     maxHeight: 50,
//     minHeight: 35,
//     overflow: 'hidden',
//   },
// }));

// const StyledheaderTableCell = styled(TableCell)(({ theme, increase }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     color: '#1C2A39',
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//     // fontSize: 40,
//     fontFamily: 'Roboto',
//     fontStyle: 'normal',
//     fontWeight: 500,
//     fontSize: increase ? 20 : 14,
//     padding: theme.spacing(0.5, 2),
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//     color: '#5C6878',
//     fontStyle: 'normal',
//     fontWeight: 'normal',
//     wordWrap: 'break-word',
//     position: 'sticky',
//     top: 0,
//     zIndex: 10,
//   },
// }));
// const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: selected ? 'rgb(206, 237, 253)' : 'rgba(250, 250, 250, 1)',
//   },
//   '&:nth-of-type(even)': {
//     backgroundColor: selected ? 'rgb(206, 237, 253)' : 'rgba(255, 255, 255, 1)',
//   },
//   // hide last border
//   ' &:last-child th': {
//     border: 0,
//   },
// }));
// const useStyles = makeStyles({
//   customTableContainer: {
//     overflowX: 'auto',
//   },
//   head: {
//     backgroundColor: '#fff',
//     position: 'sticky',
//     top: 0,
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#FAFAFA',
//     fontSize: 14,
//   },
// });
// // Create an editable cell renderer
// const EditableCell = ({
//   value: initialValue,
//   row: { index },
//   column: { id },
//   updateMyData, // This is a custom function that we supplied to our table instance
// }) => {
//   // We need to keep and update the state of the cell normally
//   const classes = useStyles();

//   const [value, setValue] = React.useState(initialValue);

//   const onChange = (e) => {
//     setValue(e.target.value);
//   };

//   // We'll only update the external data when the input is blurred
//   const onBlur = () => {
//     updateMyData(index, id, value);
//   };

//   // If the initialValue is changed external, sync it up with our state
//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   return (
//     <TextField
//       size="small"
//       value={value}
//       onChange={onChange}
//       onBlur={onBlur}
//       // className={classes.input}
//       className="inputedit"
//     />
//   );
// };

// // Set our editable cell renderer as the default Cell renderer
// const defaultColumn = {
//   Cell: EditableCell,
// };

// // Be sure to pass our updateMyData and the skipPageReset option
// function CustomTable({
//   columns,
//   data,
//   updateMyData,
//   skipPageReset,
//   headerFilter,
// }) {
//   // For this example, we're using pagination to illustrate how to stop
//   // the current page from resetting when our data changes
//   // Otherwise, nothing is different here.
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn,
//       // use the skipPageReset option to disable page resetting temporarily
//       autoResetPage: !skipPageReset,
//       // updateMyData isn't part of the API, but
//       // anything we put into these options will
//       // automatically be available on the instance.
//       // That way we can call this function from our
//       // cell renderer!
//       updateMyData,
//     },

//     useFilters,
//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useResizeColumns,
//     useFlexLayout,
//     useSticky,
//   );

//   // Render the UI for your table
//   return (
//     <Paper className="uniqueName" sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer>
//         <Table
//           size="small"
//           stickyHeader
//           aria-label="sticky table"
//           {...getTableProps()}
//         >
//           <TableHead>
//             {headerGroups.map((headerGroup) => (
//               <TableRow {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map((column) => (
//                   <StyledheaderTableCell
//                     // increase={fontSizeLg}
//                     // className={classes.head}
//                     {...column.getHeaderProps(column.getSortByToggleProps())}
//                   >
//                     {column.render('Header')}
//                     <span>
//                       {column.isSorted ? (
//                         column.isSortedDesc ? (
//                           <ArrowDownwardIcon
//                             sx={{
//                               fontSize: 16,
//                             }}
//                           />
//                         ) : (
//                           <ArrowUpwardIcon
//                             sx={{
//                               fontSize: 16,
//                             }}
//                           />
//                         )
//                       ) : null}
//                     </span>
//                   </StyledheaderTableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHead>
//           {headerFilter && (
//             <TableHead>
//               <TableRow>
//                 {headerGroups.map((headerGroup) => (
//                   <TableRow {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <StyledTableCell {...column.getHeaderProps()}>
//                         <div>
//                           {column.canFilter ? column.render('Filter') : null}
//                         </div>
//                       </StyledTableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableRow>
//             </TableHead>
//           )}
//           <TableBody {...getTableBodyProps()}>
//             {page.map((row) => {
//               prepareRow(row);
//               return (
//                 <StyledTableRow
//                   hover={true}
//                   // selected={row.id === selected}
//                   {...row.getRowProps(row)}
//                 >
//                   {row.cells.map((cell) => {
//                     return (
//                       <StyledTableCell
//                         {...cell.getCellProps([
//                           {
//                             className: cell.column.className,
//                             style: cell.column.style,
//                           },
//                           // getCellProperties(cell),
//                         ])}
//                       >
//                         {cell.render('Cell')}
//                       </StyledTableCell>
//                     );
//                   })}
//                 </StyledTableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }

// function EditableReactTable({ headerFilter }) {
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: 'Name',
//         columns: [
//           {
//             Header: 'First Name',
//             accessor: 'firstName',
//           },
//           {
//             Header: 'Last Name',
//             accessor: 'lastName',
//           },
//         ],
//       },
//       {
//         Header: 'Info',
//         columns: [
//           {
//             Header: 'Age',
//             accessor: 'age',
//           },
//           {
//             Header: 'Visits',
//             accessor: 'visits',
//           },
//           {
//             Header: 'Status',
//             accessor: 'status',
//           },
//           {
//             Header: 'Profile Progress',
//             accessor: 'progress',
//           },
//         ],
//       },
//     ],
//     [],
//   );

//   const [data, setData] = React.useState(() => makeData(20));
//   const [originalData] = React.useState(data);
//   const [skipPageReset, setSkipPageReset] = React.useState(false);

//   // We need to keep the table from resetting the pageIndex when we
//   // Update data. So we can keep track of that flag with a ref.

//   // When our cell renderer calls updateMyData, we'll use
//   // the rowIndex, columnId and new value to update the
//   // original data
//   const updateMyData = (rowIndex, columnId, value) => {
//     // We also turn on the flag to not reset the page
//     setSkipPageReset(true);
//     setData((old) =>
//       old.map((row, index) => {
//         if (index === rowIndex) {
//           return {
//             ...old[rowIndex],
//             [columnId]: value,
//           };
//         }
//         return row;
//       }),
//     );
//   };

//   // After data chagnes, we turn the flag back off
//   // so that if data actually changes when we're not
//   // editing it, the page is reset
//   React.useEffect(() => {
//     setSkipPageReset(false);
//   }, [data]);

//   // Let's add a data resetter/randomizer to help
//   // illustrate that flow...
//   // const resetData = () => setData(originalData);

//   return (
//     <Styles>
//       {/* <button onClick={resetData}>Reset Data</button> */}
//       <CustomTable
//         columns={columns}
//         data={data}
//         updateMyData={updateMyData}
//         skipPageReset={skipPageReset}
//         headerFilter={headerFilter}
//       />
//     </Styles>
//   );
// }

// export default EditableReactTable;

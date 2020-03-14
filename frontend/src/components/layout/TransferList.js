// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import List from '@material-ui/core/List';
// import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import Checkbox from '@material-ui/core/Checkbox';
// import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider';
// import { createMuiTheme } from '@material-ui/core/styles';
// import axios from 'axios';

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       light: '#33c9dc',
//       main: '#00bcd4',
//       dark: '#008394',
//       contrastText: '#fff'
//     },
//     secondary: {
//       light: '#ff6333',
//       main: '#ff3d00',
//       dark: '#b22a00',
//       contrastText: '#fff'
//     },
//     // Used by `getContrastText()` to maximize the contrast between
//     // the background and the text.
//     contrastThreshold: 3,
//     // Used by the functions below to shift a color's luminance by approximately
//     // two indexes within its tonal palette.
//     // E.g., shift from Red 500 to Red 300 or Red 700.
//     tonalOffset: 0.2,
//   },
// });

// function not(a, b) {
//   return a.filter(value => b.indexOf(value) === -1);
// }

// function intersection(a, b) {
//   return a.filter(value => b.indexOf(value) !== -1);
// }

// function union(a, b) {
//   return [...a, ...not(b, a)];
// }

// var result = [];
// function getAllMusic() {
//   axios.get('/playlist').then(update);
// }

// function update(response) {
//   result = response.data;
// }

// function generateList(array) {
//     var start = 0;
//     //var obj = JSON.parse(array);
//    // var length = Object.keys(obj).length;
//     //console.log(obj);
// }


// // TransferList.initalize = function() {
// //   getAllMusic();
// //   var length = result.length;
// //   var initialState = [];
// //   for (let i = 0; i < length; i++) {
// //     initialState.push(i);
// //   }
// //   TransferList.setLeft([...initialState]);
// // }

// export default function TransferList() {

//   const [checked, setChecked] = React.useState([]);
//   const [left, setLeft] = React.useState([]);
//   const [right, setRight] = React.useState([]);

//   const leftChecked = intersection(checked, left);
//   const rightChecked = intersection(checked, right);

//   const handleToggle = value => () => {
//     const currentIndex = checked.indexOf(value);
//     const newChecked = [...checked];

//     if (currentIndex === -1) {
//       newChecked.push(value);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }

//     setChecked(newChecked);
//   };

//   const numberOfChecked = items => intersection(checked, items).length;

//   const handleToggleAll = items => () => {
//     if (numberOfChecked(items) === items.length) {
//       setChecked(not(checked, items));
//     } else {
//       setChecked(union(checked, items));
//     }
//   };

//   const handleCheckedRight = () => {
//     setRight(right.concat(leftChecked));
//     setLeft(not(left, leftChecked));
//     setChecked(not(checked, leftChecked));
//   };

//   const handleCheckedLeft = () => {
//     setLeft(left.concat(rightChecked));
//     setRight(not(right, rightChecked));
//     setChecked(not(checked, rightChecked));
//   };

//   const customList = (title, items) => (
//     <Card style={{width: 500, position: 'relative', margin: "auto"}}>
//       <CardHeader
//         style={{padding: 4, width: 500}}
//         avatar={
//           <Checkbox
//             onClick={ () => handleToggleAll(items)}
//             checked={numberOfChecked(items) === items.length && items.length !== 0}
//             indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
//             disabled={items.length === 0}
//             inputProps={{ 'aria-label': 'all items selected' }}
//           />
//         }
//         title={title}
//         subheader={`${numberOfChecked(items)}/${items.length} selected`}
//       />
//       <Divider/>
//       <List dense component="div" role="list" style={{textAlign: 'center', width: 500, height: 500, backgroundColor: theme.palette.background.paper, overflow: 'auto'}}>
//         {items.map(value => {
//           const labelId = `transfer-list-all-item-${value}-label`;

//           return (
//             <ListItem key={value} role="listitem" button onClick={() => handleToggle(value)} alignItems="flex-start">
//               <ListItemIcon>
//                 <Checkbox
//                   checked={checked.indexOf(value) !== -1}
//                   tabIndex={-1}
//                   disableRipple
//                   inputProps={{ 'aria-labelledby': labelId }}
//                 />
//               </ListItemIcon>
//               <ListItemText id={labelId} primary={`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ${value + 1}`} secondary={'haha'} />
//             </ListItem>
//           );
//         })}
//         <ListItem />
//       </List>
//     </Card>
//   );

//   return (
//     <Grid container spacing={2} justify="center" alignItems="center" style={{margin:'auto'}}>
//       <Grid item>{customList('Current Playlist', left)}</Grid>
//       <Grid item>
//         <Grid container direction="column" alignItems="center">
//           <Button
//             variant="outlined"
//             size="small"
//             style={{margin: 20, position: 'relative'}}
//             onClick={() => handleCheckedRight}
//             disabled={leftChecked.length === 0}
//             aria-label="move selected right"
//           >
//             &gt;
//           </Button>
//           <Button
//             variant="outlined"
//             size="small"
//             style={{margin: 20, position: 'relative'}}            
//             onClick={() => handleCheckedLeft}
//             disabled={rightChecked.length === 0}
//             aria-label="move selected left"
//           >
//             &lt;
//           </Button>
//         </Grid>
//       </Grid>
//       <Grid item>{customList('Not Listening for now', right)}</Grid>
//     </Grid>
//   );
// }


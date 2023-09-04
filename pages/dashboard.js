import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert, Button, CircularProgress, Container, Grid, Dialog, DialogContent, DialogActions, Divider, IconButton, Snackbar, Stack, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavBar from '../components/navbar';
import ReceiptRow from '../components/receiptRow';
import ExpenseDialog from '../components/expenseDialog';
import { useAuth } from '../firebase/auth';
import { calculateTotalSpent, deleteReceipt, getReceipts } from '../firebase/firestore';
import { deleteImage } from '../firebase/storage';
import styles from '../styles/dashboard.module.scss';
import React from 'react';
import styled from '@mui/system/styled';


const ADD_SUCCESS = "Receipt was successfully added!";
const ADD_ERROR = "Receipt was not successfully added!";
const EDIT_SUCCESS = "Receipt was successfully updated!";
const EDIT_ERROR = "Receipt was not successfully updated!";
const DELETE_SUCCESS = "Receipt successfully deleted!";
const DELETE_ERROR = "Receipt not successfully deleted!";

// Enum to represent different states of receipts
export const RECEIPTS_ENUM = Object.freeze({
  none: 0,
  add: 1,
  edit: 2,
  delete: 3,
});

/* The `SUCCESS_MAP` constant is an object that maps the different actions (add, edit, delete) to their
corresponding success messages. It is used to display the appropriate success message in the
snackbar when a certain action is successfully completed. */
const SUCCESS_MAP = {
  [RECEIPTS_ENUM.add]: ADD_SUCCESS,
  [RECEIPTS_ENUM.edit]: EDIT_SUCCESS,
  [RECEIPTS_ENUM.delete]: DELETE_SUCCESS
}

/* The `ERROR_MAP` constant is an object that maps the different actions (add, edit, delete) to their
corresponding error messages. It is used to display the appropriate error message in the snackbar
when a certain action fails to complete successfully. */
const ERROR_MAP = {
  [RECEIPTS_ENUM.add]: ADD_ERROR,
  [RECEIPTS_ENUM.edit]: EDIT_ERROR,
  [RECEIPTS_ENUM.delete]: DELETE_ERROR
}

export default function Dashboard() {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [action, setAction] = useState(RECEIPTS_ENUM.none);

  // State involved in loading, setting, deleting, and updating receipts
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
  const [deleteReceiptId, setDeleteReceiptId] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [deleteReceiptImageBucket, setDeleteReceiptImageBucket] = useState("");
  const [updateReceipt, setUpdateReceipt] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);


  // State involved in snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setErrorSnackbar] = useState(false);

  
  /**
   * The function `onResult` sets a snackbar message based on the success or failure of a receipt and
   * updates the snackbar state accordingly.
   * @param receiptEnum - The `receiptEnum` parameter is an enumeration value that represents a
   * specific type of receipt. It is used to determine the message to display in the snackbar based on
   * whether the operation was successful or not.
   * @param isSuccess - The `isSuccess` parameter is a boolean value that indicates whether the
   * operation was successful or not. If `isSuccess` is `true`, it means the operation was successful.
   * 
   * If `isSuccess` is `false`, it means the operation encountered an error.
   */
  const onResult = async (receiptEnum, isSuccess) => {
    setSnackbarMessage(isSuccess ? SUCCESS_MAP[receiptEnum] : ERROR_MAP[receiptEnum]);
    isSuccess ? setSuccessSnackbar(true) : setErrorSnackbar(true);
    setAction(RECEIPTS_ENUM.none);
  }


/** 
  * The `useEffect` hook is used to redirect the user to the login page if they are not authenticated
  * (`authUser` is `null`) and the loading process (`isLoading`) has finished. It listens for changes in
  * the `authUser` and `isLoading` variables and triggers the callback function when either of them
  * changes. If the condition `!isLoading && !authUser` is true, it means that the user is not
  * authenticated and the loading process has finished, so the user is redirected to the login page
  * using `router.push('/')`. */
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);


  
  /* The `useEffect` hook is used to fetch the receipts for the authenticated 
     user and update the`receipts` state variable. */
  useEffect(async () => {
    if (authUser) {
      const unsubscribe = await getReceipts(authUser.uid, setReceipts, setIsLoadingReceipts);
      return () => unsubscribe();
    }
  }, [authUser])

  /* The `useEffect` hook is used to calculate the total amount spent by the user and update the
     `totalSpent` state variable. */
  useEffect(async () => {
    if (authUser) {
      const totalSpent = await calculateTotalSpent(authUser.uid);
      setTotalSpent(totalSpent);
    }
  }, [authUser]);


  /**
   * The onClickAdd function sets the action to add a receipt and updates the receipt object.
   */
  const onClickAdd = () => {
    setAction(RECEIPTS_ENUM.add);
    setUpdateReceipt({});
  }

  /**
   * The onUpdate function sets the action to "edit" and updates the receipt.
   * @param receipt - The `receipt` parameter is an object that represents a receipt. It likely
   * contains various properties such as the receipt ID, the items purchased, the total amount, the
   * date of purchase, etc.
   */
  const onUpdate = (receipt) => {
    setAction(RECEIPTS_ENUM.edit);
    setUpdateReceipt(receipt);
  }

 /**
  * The onClickDelete function sets the action, receipt ID, and image bucket for deleting a receipt.
  * @param id - The `id` parameter is the unique identifier of the receipt that needs to be deleted.
  * @param imageBucket - The `imageBucket` parameter is a string that represents the name or identifier
  * of the bucket where the image associated with the receipt is stored.
  */
  const onClickDelete = (id, imageBucket) => {
    setAction(RECEIPTS_ENUM.delete);
    setDeleteReceiptId(id);
    setDeleteReceiptImageBucket(imageBucket);
  }

 /**
  * The function `resetDelete` resets the action and deleteReceiptId variables to their initial values.
  */
  const resetDelete = () => {
    setAction(RECEIPTS_ENUM.none);
    setDeleteReceiptId("");
  }

/**
 * The `onDelete` function deletes a receipt and its associated image, calculates the new total spent,
 * and then calls the `onResult` function with the result.
 */
  const onDelete = async () => {
    let isSucceed = true;
    try {
      await deleteReceipt(deleteReceiptId);
      await deleteImage(deleteReceiptImageBucket);

      const newTotalSpent = await calculateTotalSpent(authUser.uid);
      setTotalSpent(newTotalSpent);
    } catch (error) {
      isSucceed = false;
    }
    resetDelete();
    onResult(RECEIPTS_ENUM.delete, isSucceed);
  }

 // Create a styled component calledb `Item`. 
  const Item = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? '#444d58' : '#ced7e0',
    padding: theme.spacing(1),
    borderRadius: '4px',
    textAlign: 'center',
  }));

 
  return (
    <div>
      {!authUser ? (
        <CircularProgress color="inherit" sx={{ marginLeft: '50%', marginTop: '25%' }} />
      ) : (
        <div>
          <Head>
            <title>ExpenseTracker</title>
          </Head>

          <NavBar />
          <Container>
            <Snackbar
              open={showSuccessSnackbar}
              autoHideDuration={1500}
              onClose={() => setSuccessSnackbar(false)}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            >
              <Alert onClose={() => setSuccessSnackbar(false)} severity="success">
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <Snackbar
              open={showErrorSnackbar}
              autoHideDuration={1500}
              onClose={() => setErrorSnackbar(false)}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            >
              <Alert onClose={() => setErrorSnackbar(false)} severity="error">
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <Stack direction="column" alignItems="left" sx={{ paddingTop: '1.5em' }}>
              <Typography variant="h5" sx={{ lineHeight: 3, paddingRight: '0.5em' }}>
                Benvenuto/a, ecco tutte le tue spese!
              </Typography>
            </Stack>
            {receipts.map((receipt) => (
              <div key={receipt.id}>
                <Divider light />
                <ReceiptRow
                  receipt={receipt}
                  onEdit={() => onUpdate(receipt)}
                  onDelete={() => onClickDelete(receipt.id, receipt.imageBucket)}
                />
              </div>
            ))}
            <Typography variant="h5" sx={{ lineHeight: 2, paddingRight: '0.5em' }}>
              Premi per aggiungere una nuova spesa
              <IconButton aria-label="edit" color="secondary" onClick={onClickAdd} className={styles.addButton}>
                <AddIcon />
              </IconButton>
            </Typography>
            <Box sx={{ paddingTop: '1em' }}>
              <Typography variant="h4" sx={{ lineHeight: 2, paddingRight: '0.5em' }}>
                Totale speso: {totalSpent} {/* Mostra il valore con due decimali */}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={-2} columns={16}>
              <Grid xs={8}>
                <Item><Typography variant="h4" sx={{ lineHeight: 2, paddingRight: '0.5em' }}>
                  La tua spesa minima: {Math.min(...receipts.map(item => item.amount))} euro {/* Mostra il valore con due decimali */}
                </Typography></Item>
              </Grid>
              <Grid xs={8}>
                <Item><Typography variant="h4" sx={{ lineHeight: 2, paddingRight: '0.5em' }}>
                  La tua spesa massima: {Math.max(...receipts.map(item => item.amount))} euro {/* Mostra il valore con due decimali */}
                </Typography></Item>
              </Grid>
            </Grid>
            </Box>
            </Box>
           
          </Container>
          <ExpenseDialog
            edit={updateReceipt}
            showDialog={action === RECEIPTS_ENUM.add || action === RECEIPTS_ENUM.edit}
            onError={(receiptEnum) => onResult(receiptEnum, false)}
            onSuccess={(receiptEnum) => onResult(receiptEnum, true)}
            onCloseDialog={() => setAction(RECEIPTS_ENUM.none)}
          />
          <Dialog open={action === RECEIPTS_ENUM.delete} onClose={resetDelete}>
            <Typography variant="h4" className={styles.title}>
              DELETE EXPENSE
            </Typography>
            <DialogContent>
              <Alert severity="error">This will permanently delete your receipt!</Alert>
            </DialogContent>
            <DialogActions sx={{ padding: '0 24px 24px' }}>
              <Button color="secondary" variant="outlined" onClick={resetDelete}>
                Cancel
              </Button>
              <Button color="secondary" variant="contained" autoFocus onClick={onDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );

};

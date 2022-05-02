import React from 'react';
import { useState,useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { filterBySellerAndCategories, deleteProduct } from '../../redux/actions/a.products.js';
import {delAlert} from '../../redux/actions/a.alert'
import { updateProduct, postProduct } from '../../redux/actions/a.seller.js'
import spinner from '../../spinner.gif'
// import { postProduct } from '../../../redux/actions/a.seller.js'

import { useAuth } from '../../context/AuthContext'

import NavBar from '../../components/NavBar/NavBar'
import DatosVendedor from '../../components/Vendedor/DatosVendedor/DatosVendedor'
import CardVendedor from '../../components/Vendedor/CardVendedor/CardVendedor'
import AddProduct from '../../components/Vendedor/AddProduct/AddProduct.jsx'
// import HistoryHome from '../../components/Vendedor/HistorialVentas/HistoryHome.jsx'
import { Container, Typography, Button } from '@mui/material'
import {Snackbar} from '@mui/material';
import {SnackbarAlert} from '../../components/Alert/success';

export default function Vendedor(){
    const alert = useSelector(state => state.alert)
    const products = useSelector(state => state.productsBySeller, shallowEqual)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const { oneUser, currentUser } = useAuth()
    // Form Modal 
    const [prodId, setProdId] = useState(null)
    const [input, setInput] = useState({
        name: "",
        description: "",
        image: "",
        stock: "",
        category: [],
        price: "",
        userId: currentUser?.uid
    });
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setProdId(null)
        setInput({
            name: "",
            description: "",
            image: "",
            stock: "",
            category: [],
            price: "",
            userId: currentUser.uid
        })
        setOpen(false)
    }
    async function handleSubmit(e){
        e.preventDefault();
        if(prodId === null){
            dispatch(postProduct(input, currentUser))
            handleClose()
        }else{
            await dispatch(updateProduct(input, prodId, currentUser))
            handleClose()
        }
        // prodId === null ?
        // dispatch(postProduct(input))
        // : dispatch(updateProduct(input, prodId))
    }
    function handleCloseAlert(){
        dispatch(delAlert())
    }




    // Products by User
    useEffect(() => {
        dispatch(filterBySellerAndCategories(oneUser?._id))
        setTimeout(() => {
            setLoading(false)
        }, 500);
    },[dispatch,oneUser])

    const removeProduct = async (id) => {
        await dispatch(deleteProduct(id, currentUser))
        dispatch(filterBySellerAndCategories(oneUser._id))
        // return products = products.filter(product => product._id !== id)
    }
//ACOMODAR ESTO 
    return (
        <>
        <NavBar />
        {/* <HistoryHome /> */}
        <Container sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <DatosVendedor 
                        name={oneUser.name}
                        address={oneUser.address}
                        email={oneUser.email}
                        delivery={oneUser.delivery}
                        phone={oneUser.phone}
                        image={oneUser.image}
                        />
            <Container sx={{
                height: '500px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                borderRadius: '10px',
            }}>
                <Container sx={{
                    height: '70px',
                    margin: '5px 0',
                    display: 'flex',
                    borderBottom: '2px solid black',
                    alignItems: 'center',
                }}>
                    <Typography variant="h6">
                        TUS PRODUCTOS
                    </Typography>
                    <Button 
                        onClick={() => navigate('/orderHistory')}
                        variant="contained" 
                        color="primary" 
                        sx={{
                            left: '700px',
                            fontWeight: '600',
                        }}
                    >
                        Ventas
                    </Button>
                    <Button 
                        onClick={handleOpen}
                        variant="contained" 
                        color="info" 
                        sx={{
                            left: '720px',
                            fontWeight: '600',
                        }}
                    >
                        Agregar
                    </Button>
                    <AddProduct 
                        prodId={prodId}
                        input={input}
                        setInput={setInput}
                        open={open}
                        handleClose={handleClose}
                        handleSubmit={handleSubmit}
                    />
                </Container>
                <Container sx={{
                height: '335px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                overflow: 'auto',
                borderRadius: '10px'
            }}>
                {loading ? <img src={spinner} alt="" style={{width: '150px', height: 'max-content'}} /> : products.length ? products.map((producto, id) => <CardVendedor 
                                            key={id}
                                            id={producto._id}
                                            nombre={producto.name}
                                            image={producto.image}
                                            stock={producto.stock || "Sin Stock"}
                                            precio={producto.price}
                                            category={producto.category}
                                            description={producto.description}
                                            handleClose={handleClose}
                                            handleOpen={handleOpen}
                                            handleSubmit={handleSubmit}
                                            removeProduct={removeProduct}
                                            input={input}
                                            setInput={setInput}
                                            prodId={prodId}
                                            setProdId={setProdId}
                                            />) : <Typography variant='h5' sx={{margin: 'auto'}}>
                                                    NO HAY PRODUCTOS
                                                </Typography>}
                </Container>
            </Container>
        </Container>
        <Snackbar open={!!alert} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}>
                <SnackbarAlert onClose={handleCloseAlert} color='primary' variant='filled' severity='success'>
                    {alert}
                </SnackbarAlert>
            </Snackbar>

        </>
    )
}
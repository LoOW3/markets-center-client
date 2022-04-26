import React from 'react';
import {useSelector} from 'react-redux';
import styles from './NavBar.module.css'
import SearchBar from './SearchBar.jsx'
import Logo from '../../images/MC-Full.png'
//
import Filters from '../Filters/Filters.jsx';
//

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { resetSliders, idActiveSeller,idActiveCategory } from '../../redux/actions/a.products'
import { useDispatch } from 'react-redux';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import Stack from '@mui/material/Stack';
import { Person } from '@mui/icons-material';
import Badge from '@mui/material/Badge';

export default function NavBar({ searchBar, home, admin, value, setValue }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { logout, oneUser, currentUser } = useAuth();
    const countItemsCar = useSelector(state => state.addOrdercar)
    const temp = window.localStorage.getItem('products');
    const countItemsCarTemp = temp && JSON.parse(temp);

    async function logoutHandler() {
        await logout();
        navigate('/')
    }

    function handleSelect() {
        navigate('/');
        dispatch(resetSliders())
        dispatch(idActiveSeller())
        dispatch(idActiveCategory())
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.target);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

                    <IconButton cursor="pointer" onClick={handleSelect}>
                        <img src={Logo} alt="Logo" className={styles.logo} />
                    </IconButton>
                    {
                        searchBar &&
                        <SearchBar />
                    }

                    <Stack direction="row">
                        <div>
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                    {
                                    home && (
                                        <Tooltip title="Carrito de compras" >
                                            <IconButton
                                                onClick={() => navigate('/Carrito')}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                color="white">
                                                <Badge color="secondary" badgeContent={countItemsCar?.length || countItemsCarTemp.length}>
                                                    <LocalGroceryStoreOutlinedIcon />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>)
                                    }
                                <Tooltip title="Cuenta">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar src={oneUser.image ? oneUser.image : '/broken-image.jpg'} sx={{ width: 32, height: 32, objectFit: 'cover' }}></Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgColor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => navigate('/Login')}>
                                    <ListItemIcon>
                                        <Person />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                {
                                    currentUser === null ? undefined :
                                        (
                                            <div>
                                                <Divider />
                                                <MenuItem onClick={logoutHandler}>
                                                    <ListItemIcon>
                                                        <Logout />
                                                    </ListItemIcon>Cerrar sesión

                                                </MenuItem>
                                            </div>
                                        )
                                }
                            </Menu>
                        </div>
                    </Stack>
                </Toolbar>
            </Container>
            <Filters home={home} admin={admin} value={value} setValue={setValue} />
        </AppBar>
    )
}


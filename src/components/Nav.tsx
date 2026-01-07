import * as React from 'react';

// import Router from 'react-router-dom';
import {
    // BrowserRouter, Routes, Route,
    RouterProvider,
    Outlet,
    useOutlet,
    createBrowserRouter,
    useNavigate,
} from 'react-router-dom';

import Game from './Game.tsx';

import About from '../pages/About.tsx';
import Error from '../pages/Error.tsx';
import Home from '../pages/Home.tsx';
import Play from '../pages/Play.tsx';
import Users, { ContactDisplay, EditContact, profilesLoader, createProfileAction, profileLoader, editProfileAction, deleteProfileAction } from '../pages/Profile.tsx';

// this file taken and adapted from https://mui.com/material-ui/react-drawer/
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DescriptionIcon from '@mui/icons-material/Description';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import CodeIcon from '@mui/icons-material/Code';
import AnimatedLogo from './AnimatedLogo.jsx';

import { keyframes } from '@mui/material/styles';
import { Edit } from '@mui/icons-material';
// import { Keyframes } from '@mui/styled-engine-sc';
// import { Keyframes } from '@emotion/react';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const drawerElementMap = {
    // 'Root': {
    //     icon: null,
    //     // label: 'Root',
    //     url: '/',
    //     component: <></>,
    // },
    'Home': {
        icon: HomeIcon,
        url: '/home',
    },
    'Play': {
        icon: SportsEsportsIcon,
        url: '/play',
    },
    'Study': {
        icon: DescriptionIcon,
        url: '/study',
    },
    'Profile': {
        icon: PeopleIcon,
        url: '/users',
    },
    'About': {
        icon: InfoIcon,
        url: '/about',
    },
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    backgroundColor: '#2f2f2f',
    color: '#ffffff',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                backgroundColor: '#2f2f2f',
                color: '#ffffff',
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function MiniDrawer(props: any) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate();

    const handleSideDrawerClick = (event: React.MouseEvent, eventItemText: string) => {
        if (event) event.preventDefault();
        if (!Object.keys(drawerElementMap).includes(eventItemText)) {
            console.error(`${eventItemText} does not exist.`);
            navigate("error");
            throw Error();
        }

        const eventItem = drawerElementMap[eventItemText as keyof typeof drawerElementMap];
        const newUrl = `${eventItem?.url}`;
        // Use react-router navigation so the RouterProvider updates correctly.
        try {
            navigate(newUrl);
        } catch (err) {
            // fallback to history if navigate isn't available
            window.history.pushState({}, '', newUrl);
        }
    }
    // Render children from props so RouterProvider route changes update content.
    const outlet = useOutlet();
    const children = (
        <Box component="main" sx={{ flexGrow: 1, p: 3, color: 'white' }}>
            <DrawerHeader />
            {
                props.children || 
                outlet || 
                <AnimatedLogo size={560} />
            }
        </Box>
    );

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // const squeezeAnimation = keyframes(
    //     `
    //         0% { transform: scale(1); }
    //         25% { transform: scale(1.2); }
    //         50% { transform: scale(1.3, 0.9) }
    //         75% { transform: scale(1.2); }
    //         100% { transform: scale(1); }  
    //     `
    // );

    // ff0000: red
    // ffff00: yellow
    // 00ff00: green
    // 00ffff: teal/aqua
    // 0000ff: blue
    // ff00ff: purple
    // TODO do something more like what's in AnimatedLogo 
    const rainbowAnimation = keyframes(
        `
            0% { color: #ff0000ff }
            14% { color: #ff9900ff }
            28% { color: #ffff00ff }
            42% { color: #00ff00ff }
            56% { color: #00ff2266 }
            71% { color: #0000ffff }
            85% { color: #ff00ff55 }
            100% { color: #ff0022aa }
        `
    );

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar 
                    // className='toolbar top'
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography 
                        variant="h6" 
                        noWrap 
                        component="div" 
                        // className="header"
                        sx={{
                            '&:hover': {
                                animation: `${rainbowAnimation} 12s linear infinite`,
                            },
                            cursor: 'pointer',
                        }}
                        // onClick={() => window.open('https://chess.jarmigo.com', '_self')}
                        onClick={() => navigate('/')}
                    >
                        Jarmigo Chess
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="navigate portfolio"
                        onClick={() => window.open('https://www.jarmigo.com', '_blank')}
                        sx={[
                            {
                                marginLeft: 'auto',
                                // flexGrow: 1,
                            },
                        ]}
                    >
                        <SelfImprovementIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="navigate sourcecode"
                        onClick={() => window.open('https://github.com/jmgorton/chess-notes', '_blank')}
                    >
                        <CodeIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer 
                variant="permanent" 
                open={open} 
                // className='toolbar sidedrawer'
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {Object.keys(drawerElementMap).map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    open
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}
                                onClick={(event) => handleSideDrawerClick(event, text)}
                                // href={drawerElementMap[text as keyof typeof drawerElementMap].url}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                        open
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                                    {React.createElement(drawerElementMap[text as keyof typeof drawerElementMap].icon) || <QuestionMarkIcon />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {children}
        </Box>
    );
}

export function Nav() {
    const router = createBrowserRouter([
        {
            path: "/",
            // element: <MiniDrawer children={<AnimatedLogo size={600}/>} />, // <Root />, 
            // errorElement: <MiniDrawer children={<Error />} />,
            element: <MiniDrawer />,
            errorElement: <Error />, // errors bubble up from children to the nearest parent's error element as long as there's one at root 
            children: [
                {
                    path: "home",
                    element: <Home />,
                },
                {
                    path: "about",
                    element: <About />,
                },
                {
                    path: "users",
                    element: <Users />,
                    loader: profilesLoader,
                    action: createProfileAction,
                    children: [
                        {
                            path: ":friendId",
                            element: <ContactDisplay />,
                            loader: profileLoader,
                            errorElement: <Error />,
                        },
                        {
                            path: ":friendId/edit",
                            element: <EditContact />,
                            loader: profileLoader, // use the same loader as for viewing a contact/profile 
                            // (You might note we reused the contactLoader for this route. This is only because we're being lazy in the tutorial. 
                            // There is no reason to attempt to share loaders among routes, they usually have their own.)
                            action: editProfileAction,
                            errorElement: <Error />,
                        },
                        {
                            // annoying warning: Matched leaf route at location "/users/rs8xuqj/destroy" does not have an element or Component. 
                            // This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.
                            path: ":friendId/destroy",
                            element: <></>,
                            action: deleteProfileAction,
                            errorElement: <Error />,
                        }
                    ]
                },
                {
                    path: "play", // /[variants/{variantType}]/{bot/,user/}
                    element: <Play />,
                    children: [
                        {
                            path: "/play/:game",
                            element: <><h2 style={{color: 'white'}}>Playing Game</h2></>,
                        }
                    ]
                },
                {
                    path: "study",
                    element: <Game />, // notes/ 
                },
            ]
        },
        // {
        //     path: "/home",
        //     element: <MiniDrawer children={<Home />} />, // <Home />,
        //     errorElement: <MiniDrawer children={<Error />} />,
        // },
        // {
        //     path: "/about",
        //     element: <MiniDrawer children={<About />} />, // <About />,
        //     errorElement: <MiniDrawer children={<Error />} />,
        // },
        // {
        //     path: "/users",
        //     element: <MiniDrawer children={<Users />} />, // <Users />,
        //     errorElement: <MiniDrawer children={<Error />} />,
        // },
        // {
        //     path: "/play", // /[variants/{variantType}]/{bot/,user/}
        //     element: <MiniDrawer children={<Play />} />,
        //     errorElement: <MiniDrawer children={<Error />} />,
        //     children: [
        //         {
        //             path: "/play/:game",
        //             element: <><h2 style={{color: 'white'}}>Playing Game</h2></>
        //         }
        //     ]
        // },
        // {
        //     path: "/study",
        //     element: <MiniDrawer children={<Game />} />, // <Game />, // notes/ 
        //     errorElement: <MiniDrawer children={<Error />} />,
        // },
        {
            path: "/error",
            element: <MiniDrawer children={<Error />} />, // <Root />, 
        },
        {
            path: "*",
            element: <Error />, // <Root />, 
        },
    ]);

    return (
        // <Router>
        //   <div>
        //     <nav>
        //       <ul>
        //         <li>
        //           <Link to="/">Home</Link>
        //         </li>
        //         <li>
        //           <Link to="/about">About</Link>
        //         </li>
        //         <li>
        //           <Link to="/users">Users</Link>
        //         </li>
        //       </ul>
        //     </nav>

        //     {/* A <Switch> looks through its children <Route>s and
        //         renders the first one that matches the current URL. 
        //         Updated <Switch> to <Routes> in React Router v6. */}
        //     <Routes>
        //       <Route path="/about" element={<About />} />
        //       <Route path="/users" element={<Users />} />
        //       <Route path="/" element={<Home />} />
        //     </Routes>
        //   </div>
        // </Router>

        // <BrowserRouter>
        //   <Routes>
        //     <Route path="/about" element={<About />} />
        //     <Route path="/users" element={<Users />} />
        //     <Route path="/" element={<Home />} />
        //   </Routes>
        // </BrowserRouter>

        <RouterProvider router={router} />
    );
}

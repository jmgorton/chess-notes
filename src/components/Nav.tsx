import * as React from 'react';

// import Router from 'react-router-dom';
import {
    // BrowserRouter, Routes, Route,
    RouterProvider,
    Outlet,
    createBrowserRouter,
    useNavigate,
} from 'react-router-dom';

import Game from './Game.tsx';

import About from '../pages/About.tsx';
import Error from '../pages/Error.tsx';
import Home from '../pages/Home.tsx';
import Play from '../pages/Play.tsx';
import Users from '../pages/Profile.tsx';

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
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

import { keyframes } from '@mui/material/styles';
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
        // label: 'Home',
        url: '/home',
        // component: <Home />,
    },
    'Play': {
        icon: SportsEsportsIcon,
        // label: 'Play',
        url: '/play',
        // component: <></>, // <Game />,
    },
    'Study': {
        icon: DescriptionIcon,
        // label: 'Study',
        url: '/study',
        // component: <Game />,
        // component: <MiniDrawer children={<Game />} />
    },
    'Profile': {
        icon: PeopleIcon,
        // label: 'Users',
        url: '/users',
        // component: <Users />,
    },
    'About': {
        icon: InfoIcon,
        // label: 'About',
        url: '/about',
        // component: <About />,
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
    const children = (
        <Box component="main" sx={{ flexGrow: 1, p: 3, color: 'white' }}>
            <DrawerHeader />
            {
                props.children || 
                <Outlet /> // || 
                
                // <AnimatedLogo size={480} />

                // <>
                //     <Typography sx={{ marginBottom: 2 }}>
                //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                //         tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                //         enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                //         imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                //         Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                //         Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                //         adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                //         nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                //         leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                //         feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                //         consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                //         sapien faucibus et molestie ac.
                //     </Typography>
                //     <Typography sx={{ marginBottom: 2 }}>
                //         Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                //         eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                //         neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                //         tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                //         sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                //         tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                //         gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                //         et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                //         tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                //         eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                //         posuere sollicitudin aliquam ultrices sagittis orci a.
                //     </Typography>
                // </>
            }
        </Box>
    );

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const squeezeAnimation = keyframes(
        `
            0% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1.3, 0.9) }
            75% { transform: scale(1.2); }
            100% { transform: scale(1); }  
        `
    );

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
                <Toolbar className='toolbar top'>
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
                                animation: `${rainbowAnimation} 3s linear infinite`,
                            },
                            cursor: 'pointer',
                        }}
                        onClick={() => window.open('https://chess.jarmigo.com', '_self')}
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
            <Drawer variant="permanent" open={open} className='toolbar sidedrawer'>
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
            element: <MiniDrawer children={<AnimatedLogo size={600}/>} />, // <Root />, 
            errorElement: <MiniDrawer children={<Error />} />,
            // children: [
            //     {
            //         path: "play",
            //         element: <><div style={{color: 'white'}}><h1>Play</h1></div><ul><li><a>Solo</a></li><li><a>Computer</a></li><li><a>Online</a></li></ul></>,
            //         children: [
            //             {
            //                 path: "play/solo",
            //                 element: <Game />,
            //             }
            //         ]
            //     }
            // ],
        },
        {
            path: "/home",
            element: <MiniDrawer children={<Home />} />, // <Home />,
            errorElement: <MiniDrawer children={<Error />} />,
        },
        {
            path: "/about",
            element: <MiniDrawer children={<About />} />, // <About />,
            errorElement: <MiniDrawer children={<Error />} />,
        },
        {
            path: "/users",
            element: <MiniDrawer children={<Users />} />, // <Users />,
            errorElement: <MiniDrawer children={<Error />} />,
        },
        {
            path: "/play", // /[variants/{variantType}]/{bot/,user/}
            element: <MiniDrawer children={<Play />} />,
            errorElement: <MiniDrawer children={<Error />} />,
            children: [
                {
                    path: "/play/:game",
                    element: <><h2 style={{color: 'white'}}>Playing Game</h2></>
                }
            ]
        },
        {
            path: "/study",
            element: <MiniDrawer children={<Game />} />, // <Game />, // notes/ 
            errorElement: <MiniDrawer children={<Error />} />,
        },
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

// function Root() {
//   return (
//     <>
//       <div id="sidebar" style={{background: 'white'}}>
//         {/* <h1>React Router Contacts</h1>
//         <div>
//           <form id="search-form" role="search">
//             <input
//               id="q"
//               aria-label="Search contacts"
//               placeholder="Search"
//               type="search"
//               name="q"
//             />
//             <div
//               id="search-spinner"
//               aria-hidden
//               hidden={true}
//             />
//             <div
//               className="sr-only"
//               aria-live="polite"
//             ></div>
//           </form>
//           <form method="post">
//             <button type="submit">New</button>
//           </form>
//         </div> */}
//         <nav>
//           <ul>
//             <li>
//               <a href={`/home`}>Home</a>
//             </li>
//             <li>
//               <a href={`/about`}>About</a>
//             </li>
//             <li>
//               <a href={`/users`}>Users</a>
//             </li>
//             <li>
//               <a href={`/play`} disabled={true}>Play</a>
//             </li>
//             <li>
//               <a href={`/study`}>Study</a>
//             </li>
//           </ul>
//         </nav>
//       </div>
//       <div id="detail"></div>
//     </>
//   );
// }

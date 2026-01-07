import React from 'react';

import { Form, useOutlet, Link, useLoaderData, redirect } from "react-router-dom";

import localforage from "localforage";
// import { matchSorter } from "match-sorter";
// import sortBy from "sort-by";

// import '../styles/Profile.module.css'; // this is bad, messes up other components like the Game/Board 
import styles from '../styles/Profile.module.css'; // needed to add .module.css to the globals.d.ts file 

interface Contact {
    id?: string,
    first?: string,
    last?: string,
    avatar?: string,
    twitter?: string,
    notes?: string,
    favorite?: boolean,
    createdAt?: number,
}

// TODO if i want to import those libraries above to make this test stuff work at some point... 
//   i'll at least do localforage right now i guess ... i don't really care about the sorting 
export async function getContacts(query?: string): Promise<Contact[] | null | undefined> { // Contact[] | undefined // unknown
    // await fakeNetwork(`getContacts:${query}`);
    let contacts: Contact[] | null | undefined = await localforage.getItem("contacts");
    if (!contacts) contacts = [];
    // if (Array.isArray(contacts) && contacts.forEach(contact => typeof contact === 'object')) {
    //     return contacts;
    // }
    //   if (query) {
    //     contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    //   }
    //   return contacts.sort(sortBy("last", "createdAt"));
    // console.warn(`Returning unknown object of type ${typeof contacts}: ${JSON.stringify(contacts)}`);
    // console.log(`isArray: ${Array.isArray(contacts)}`)
    // contacts.forEach(contact => console.log(`Contact ${JSON.stringify(contact)} of type ${typeof contact}`));
    return contacts.map(contact => {
        const newContact: Contact = {};
        return Object.assign(newContact, contact);
    });
}

export async function createContact() {
    //   await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact: Contact = { id, createdAt: Date.now() };
    let contacts: Contact[] | null | undefined = await getContacts();
    if (!contacts) contacts = [];
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

export async function getContact(id: string): Promise<Contact | undefined> {
    //   await fakeNetwork(`contact:${id}`);
    let contacts: Contact[] | null | undefined = await localforage.getItem("contacts");
    if (!contacts) return undefined;
    let contact: Contact | undefined = contacts.find(contact => contact.id === id);
    return contact;
}

export async function updateContact(id: string, updates: object): Promise<Contact | undefined> { // updates: Partial<Contact> ?? 
    //   await fakeNetwork();
    let contacts: Contact[] | null | undefined = await localforage.getItem("contacts");
    if (!contacts) {
        console.warn(`Attempted to make updates ${updates} to ${id}, but no existing contacts were found.`)
        return undefined;
    }
    let contact = contacts.find(contact => contact.id === id);
    if (!contact) {
        console.error(`No contact found for ${id}`);
        throw new Error(`No contact found for ${id}`);
    }
    Object.assign(contact, updates);
    await set(contacts); // don't need to update array, underlying object was updated 
    return contact;
}

export async function deleteContact(id: string) {
    let contacts: Contact[] | null | undefined = await localforage.getItem("contacts");
    if (!contacts) return false;
    let index = contacts.findIndex(contact => contact.id === id);
    if (index && index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

function set(contacts: Contact[] | null | undefined) {
    return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
// let fakeCache = {};
let fakeCache: { [key: string]: any } = {};

async function fakeNetwork(key?: string) {
    if (!key) {
        fakeCache = {};
    }

    if (key && fakeCache[key]) {
        return;
    }

    if (key) fakeCache[key] = true;
    return new Promise(res => {
        setTimeout(res, Math.random() * 800);
    });
}

// // ***** -------- ******

export async function profilesLoader() {
    const contacts = await getContacts();
    // console.log(`Loaded contacts: ${contacts}`)
    return contacts; // return { contacts } was incorrect ... maybe because I was working with the Root useLoaderData output to get it tsx acceptable 
}

// use the react-router action to route Form requests to, instead of the server
//   HTML forms actually cause a navigation in the browser, just like clicking a link. 
//     The only difference is in the request: links can only change the URL while forms 
//     can also change the request method (GET vs POST) and the request body (POST form data).
//   Without client side routing, the browser will serialize the form's data automatically 
//     and send it to the server as the request body for POST, and as URLSearchParams for GET. 
//     React Router does the same thing, except instead of sending the request to the server, 
//     it uses client side routing and sends it to a route action.
export async function profilesAction() {
    const contact = await createContact();
    console.log(`Created contact: ${JSON.stringify(contact)}`)
    return { contact }
}

export default function Users() {
    // return <h2 style={{ color: 'white' }}>Users</h2>;
    // or put outlet here?

    return (
        <>
            {/* <h2 style={{ color: 'white' }}>Users</h2> */}
            <Root />
        </>
    )
}

function Root() {
    const outlet = useOutlet();
    const loaderData = useLoaderData();
    let contacts: Contact[] = [];
    if (loaderData && typeof loaderData === 'object') {
        contacts = loaderData as Contact[];
    }

    return (
        <div className={styles.root}>
            <div id="sidebar" className={styles.profileSidebar}>
                <h1>React Router Contacts</h1>
                <div>
                    {/* className? idts */}
                    {/* about react routing with html form navigation on the client-side:
                        https://reactrouter.com/6.30.2/start/tutorial#data-writes--html-forms */}
                    <form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                        />
                        <div
                            id="search-spinner"
                            className={styles.searchSpinner}
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className={styles.srOnly + "sr-only"}
                            aria-live="polite"
                        ></div>
                    </form>
                    {/* instead of using the default <form/>, use the react-router <Form/> */}
                    {/* <form method="post">
                            <button type="submit">New</button>
                        </form> */}
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                    {/* The createContact method just creates an empty contact with no name or data or anything. But it does still create a record, promise!
                        🧐 Wait a sec ... How did the sidebar update? Where did we call the action? Where's the code to refetch the data? 
                            Where are useState, onSubmit and useEffect?!
                        This is where the "old school web" programming model shows up. As we discussed earlier, <Form> prevents the browser 
                            from sending the request to the server and sends it to your route action instead. In web semantics, 
                            a POST usually means some data is changing. By convention, React Router uses this as a hint to automatically 
                            revalidate the data on the page after the action finishes. That means all of your useLoaderData hooks update 
                            and the UI stays in sync with your data automatically! Pretty cool. */}
                </div>
                <nav>
                    {/* <ul>
                        <li>
                            <Link to={`/users/1`}>Your Name</Link>
                        </li>
                        <li>
                            <Link to={`/users/2`}>Your Friend</Link>
                        </li>
                    </ul> */}
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact: Contact) => {
                                // console.log(`Contact: ${contact}`);
                                return (
                                    <li key={contact.id}>
                                        <Link to={`${contact.id}`}>
                                            {contact.first || contact.last ? (
                                                <>
                                                    {contact.first} {contact.last}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}{" "}
                                            {contact.favorite && <span>★</span>}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail" className={styles.profileDetail}>
                <h2 style={{ color: 'white' }}>Users</h2>
                {
                    outlet
                }
            </div>
        </div>
    );
}

export async function profileLoader({ params }: { params: any}) {
    const contact = await getContact(params.friendId);
    return contact; // return { contact }; // destructuring renders incorrectly 
}

export function ContactDisplay() {
    // const contact: Contact = {
    //     // id: undefined,
    //     first: "Your",
    //     last: "Name",
    //     avatar: "https://robohash.org/you.png?size=200x200",
    //     twitter: "your_handle",
    //     notes: "Some notes",
    //     favorite: true,
    // };
    const contact = useLoaderData() as Contact;

    return (
        // div id="contact"
        <div id="contact" className={styles.profileContact}>
            <div>
                <img
                    key={contact.avatar}
                    src={
                        contact.avatar ||
                        // `https://robohash.org/${contact.id}.png?size=200x200`
                        ''
                    }
                    alt='contact avatar'
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !window.confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ contact }: { contact: Contact }) { // : { contact: Play }) {
    const favorite = contact.favorite;
    return (
        <Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </Form>
    );
}

export async function editProfileAction({ request, params}: {request: any, params: any}) {
    console.log(`Request: ${JSON.stringify(request)}`);
    console.log(`Params: ${JSON.stringify(params)}`);
    const formData = await request.formData();
    console.log(`Form data: ${JSON.stringify(formData)}`);
    const updates = Object.fromEntries(formData);
    await updateContact(params.friendId, updates);
    return redirect(`/users/${params.friendId}`);
}

export function EditContact() {
  const contact = useLoaderData() as Contact; // { contact } ... as Contact => property contact does not exist on type Contact // binding elements, destructuring 

  return (
    <Form method="post" id="contact-form" className={styles.contactForm}>
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}

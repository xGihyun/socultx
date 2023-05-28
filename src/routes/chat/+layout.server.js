import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params, locals }) {
    // const userStuff = locals.userStuff;
    // const userUID = userStuff.uid;
    // const receiverId = params.chatId;

    // Query to get all conversations the current user is a part of
    // const q = query(
    //     collection(db, `users/${userUID}/conversations`),
    //     where('members', 'array-contains', userUID)
    // );

    // const querySnapshot = await getDocs(q);

    // /**
    //  * @type {{ docID: string; docData: import("@firebase/firestore").DocumentData; }[]}
    //  */
    // let test = [];

    // querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     // console.log(doc.id, ' => ', doc.data());
    //     test.push({
    //         docID: doc.id,
    //         docData: doc.data()
    //     });
    // });

    const q = query(
        collection(db, `users`)
    )

    // let test = []

    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //     console.log(`SOOOOOOOOOOOOOOOoo`)
    //     console.log(doc.data())
    // })

    // APPARENTLY U NEED `+layout.server.js` in order to retrieve or return the latest `users` so that you can use it in the `chat/[chatId]`
    return {
        test: 'test chat layout',
        latestUsers: querySnapshot.docs.map((doc) => doc.data()),
    };
}

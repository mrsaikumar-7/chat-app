import { useContext, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { serverTimestamp } from "firebase/firestore";
import Pusher from 'pusher-js';

const Search = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [err, setErr] = useState(false);

  const pusher = new Pusher('2ad13bef5022d983147b', {
    cluster: 'ap2',
    encrypted: true
  });

  const handleSearch = async () => {
    try {
      console.log(username)
      const userDoc = await getDoc(doc(db, "users", username));
      console.log(userDoc)
      console.log("searched for " + username)
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.log('user not found')
        setErr(true);
      }
    } catch (err) {
      setErr(true);
    }
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const chatDoc = await getDoc(doc(db, "chats", combinedId));

      if (!chatDoc.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Trigger Pusher event for creating a channel
        pusher.trigger(`chat-${combinedId}`, 'channel-created', {
          users: [currentUser.uid, user.uid],
        });
      }
    } catch (err) {
      console.error("Error creating channel:", err);
    }

    setUser(null);
    setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSearch();
  };

  return (
    <div className="search">
      <div className="searchForm">
        <form onSubmit={handleSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Find a user"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

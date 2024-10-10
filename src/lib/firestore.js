import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';  // Import Firestore instance from firebase.js

export async function saveGeneratedContent(userInput, generatedContent, currentUser, tone, length) {
  try {
    const docRef = await addDoc(collection(db, 'contentDrafts'), {
    userId: currentUser,
      userInput: userInput,
      generatedContent: generatedContent,
      timestamp: new Date(),  // Store the timestamp when the content was generated
      tone: tone,  // Save the selected tone
      length: length,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}


export async function fetchUserGeneratedContent(currentUser) {
    try {
      // Create a query to get documents that match the current user's ID
      const q = query(collection(db, 'contentDrafts'), where('userId', '==', currentUser));

      console.log(q, "list");
      
      // Execute the query and get the documents
      const querySnapshot = await getDocs(q);
      
      // Create an array to store the retrieved documents
      const contentList = [];
      querySnapshot.forEach((doc) => {
        contentList.push({ id: doc.id, ...doc.data() });
      });
      
      // Return the content list
      return contentList;
    } catch (e) {
      console.error('Error retrieving content: ', e);
      return [];
    }
  }
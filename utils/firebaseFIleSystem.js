const { initializeApp } = require('firebase/app') ;
const { getStorage , ref , getDownloadURL , uploadBytesResumable } = require('firebase/storage')

const firebaseConfig = require('../firebaseConfig.js')

require('firebase/storage');

initializeApp(firebaseConfig);

const storage = getStorage()

async function uploadImage(folderName, imageFile) {
  try {
    const dateTime = Date.now()

    const storgaeRef = ref(storage,`${folderName}/${imageFile.originalname+"-"+dateTime}`)

    const metadata = {
      contentType : imageFile.mimeType
    }

    const snapshot = await uploadBytesResumable(storgaeRef , imageFile.buffer , metadata)

    const downloadUrl = await getDownloadURL(snapshot.ref)
    
    return(downloadUrl)

  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

module.exports = uploadImage;

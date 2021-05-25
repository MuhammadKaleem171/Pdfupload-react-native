import React,{useState} from 'react'
import {View,Text,TouchableOpacity,StyleSheet,Image,Platform} from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'
import firbaseSetup from './Setup' 
import PDFView from 'react-native-view-pdf'

const resources = {
    file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
    url: 'https://firebasestorage.googleapis.com/v0/b/awesomeproject1-700fa.appspot.com/o/AllfileMVCs_CVCs.pdf?alt=media&token=e1a5bbc4-7d56-4813-85ef-62d693fb4eab',
    base64: 'JVBERi0xLjMKJcfs...',
  };
  
const UploadToFirbase=()=>{
    const [downloadUrl,setdownload]=useState(resources.url)
    const[base64add,setbase64add]=useState('');
    const {storage}=firbaseSetup();
    const [singleFile, setSingleFile] = useState('');
  const[preview,setPreView]=useState(false);
  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
       
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(file));
      console.log('URI : ' + file.uri);
      console.log('Type : ' + file.type);
      console.log('File Name : ' + file.name);
      console.log('File Size : ' + file.size);
      setSingleFile(file);
      const path=await normalizepath(file.uri)
      console.log(path)
      RNFetchBlob.fs
  .readFile(file.uri, 'base64')
  .then((data) => {
   setbase64add(data)
   
  })
      UploadToFirbaseStorage(base64add,file);
 
 

    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  async function normalizepath(path){
      if(Platform.os==='android'){
          const filePrefix="file://";
          if(path.startsWith(filePrefix)){
              path=path.substring(filePrefix.length);
              try{
                  path=decodeURI(path)
              }catch(e){

              }
          }
      }
      return path;
  }
  async function UploadToFirbaseStorage(result,file){
const uploadTask=storage().ref(`Allfile${file.name}`).putString(result,'base64',{contentType:file.type});
console.log(uploadTask)

uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
    console.log('upload error',error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log('File available at', downloadURL);
      setdownload(downloadURL);
    });
  }
);

}
const resourceType = 'url';
return(
    <View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={selectOneFile}>
         
          <Text style={{marginRight: 10, fontSize: 19}}>
            Click here to pick one file
          </Text>
          <Image
            source={{
              uri: 'http://www.africau.edu/images/default/sample.pdf',
            }}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        <View style={{ display:'flex',width:'90%',height:'90%',backgroundColor:'red',borderWidth:1}}>
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={downloadUrl}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
</View>
    </View>
)
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 20,
    },
    textStyle: {
      backgroundColor: '#fff',
      fontSize: 15,
      marginTop: 16,
      color: 'black',
    },
    buttonStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#DDDDDD',
      padding: 5,
    },
    imageIconStyle: {
      height: 20,
      width: 20,
      resizeMode: 'stretch',
    },
  });
  export default UploadToFirbase;

import React,{useState} from 'react'
import {View,Text,TouchableOpacity,StyleSheet,Image,Button} from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'
import PDFView from 'react-native-view-pdf'
import UploadToFirbase from './UploadToFirebase'
import DateTimePicker from '@react-native-community/datetimepicker';





const App=()=>{
  const[base64add,setbase64add]=useState('');
  const resources = {
    file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : 'content://com.android.providers.downloads.documents/document/4377',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    base64: 'v1Vo19pmSWup3hmztzo0FQ4HPDbi1Zq876nhxNybpdLhyVPbn3tdMTWMiFLsJa87vJMRu/1dgzLOXO3iFtGKQ/lEoX3dfh/8tPZkqRmrBbhYecry+wctS'
  }
////////// Date time picker   
const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');
const [show, setShow] = useState(false);

//Opening Document Picker for selection of one file
  const [singleFile, setSingleFile] = useState('');
  const[preview,setPreView]=useState(false);
  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      setSingleFile(res);
      RNFetchBlob.fs
  .readFile(res.uri, 'base64')
  .then((data) => {
   console.log(data)
   setbase64add(data)
  })


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
  let uploadImage = async () => {
    //Check if any file is selected or not
    if (singleFile != null) {
      //If file selected then create FormData
      const fileToUpload = singleFile;
      const data = new FormData();
      data.append('fileToUpload', fileToUpload);
      let res = await fetch(
        'http://192.168.10.7/backend/api/values/fileToUpload',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        }
      );
      let responseJson = await res.json();
      console.log(responseJson)
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }
    } else {
      //if no file selected the show alert
      alert('Please Select File first');
    }
};
const onChange = (event, selectedDate) => {
  console.log('hhhhh',selectedDate)
  const currentDate = selectedDate || date;
  console.debug(currentDate)
  setShow(Platform.OS === 'ios');
  setDate(currentDate);
  console.log(date)
};

const showMode = (currentMode) => {
  setShow(true);
  setMode(currentMode);
};

const showDatepicker = () => {
  showMode('date');
};

const showTimepicker = () => {
  showMode('time');
};
  const PreView=()=>{
    return(
      <View style={{ display:'flex',width:'90%',height:'90%',backgroundColor:'red',borderWidth:1}}>
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={base64add}
        resourceType={resourceType}
        onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
        onError={(error) => console.log('Cannot render PDF', error)}
      />
</View>
    )
  }

  const DateSplit =()=>{
    console.log('date ',date)
    const d=date.toLocaleDateString('ko-KR');
    console.log(d)
    const d1=date.toLocaleDateString('en-GB');
    console.log(d1)
  }
  const resourceType = 'base64';
  return(

    <View>
      <View>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
          is24Hour={true}
        />
      )}
    </View>
      <View style={{marginTop:20}}>
     <TouchableOpacity

        activeOpacity={0.5}
        onPress={uploadImage}>
        <Text style={{fontSize:26,textAlign:'center'}} >Upload File</Text>
      </TouchableOpacity>
      </View>
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

        <View style={{width:200,height:200,borderWidth:1}}>
          <View style={{width:190,height:150,display:'flex'}}>
          <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={base64add}
        resourceType={resourceType}
        onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
        onError={(error) => console.log('Cannot render PDF', error)}
      />
          </View>
          <Text>{singleFile.name}</Text>
          <Text>{singleFile.size}</Text>
        </View>
        <View>
          <TouchableOpacity style={{width:'50%',height:70,display:'flex',backgroundColor:'blue',justifyContent:'center'}}
          onPress={()=>setPreView(true)}
          >
            <Text style={{textAlign:'center',color:'white',fontSize:24}}>PreView </Text>
          </TouchableOpacity>
        </View>
        <View>
          {
            preview?PreView():null
          }
          <Button onPress={DateSplit} title="Split date"/>
        </View> 
    {/* <UploadToFirbase/> */}
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
export default App;
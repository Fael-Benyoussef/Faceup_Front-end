import React, {useState,useEffect, useRef} from 'react';
import {View,TouchableOpacity,Text} from 'react-native';
import  {Button,Overlay} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';

import { Camera } from 'expo-camera';

import {MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons' ;

import {connect} from 'react-redux';


 function SnapScreen(props) {

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.torch);
  const isFocused = useIsFocused();
  const [isVisible, setIsVisible] = useState(false)

  var cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  var cameraDisplay;
  if(hasPermission && isFocused) {
    return(
      cameraDisplay = <Camera style={{ flex: 1 }}
      type={type}
      flashMode={flash}
      ref={ref => (cameraRef = ref)}
      >
        <View    
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
            
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
             <MaterialCommunityIcons
                  name="camera-retake"
                  size={20}
                  color="#ffffff"
                  /><Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
   
          <TouchableOpacity
            style={{
          
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setFlash(
                flash === Camera.Constants.FlashMode.torch
                  ? Camera.Constants.FlashMode.off
                  : Camera.Constants.FlashMode.torch
              );
            }}>
             <FontAwesome
                  name="flash"
                  size={20}
                  color="#ffffff"
                  /><Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flash </Text>
   
          </TouchableOpacity>
          
   
        </View>

         <Overlay isVisible={isVisible}
          width="auto" height="auto">
            <Text> Loading... </Text>
          </Overlay>

        {cameraDisplay}
    
        <Button

                icon={
                  <FontAwesome
                  name="save"
                  size={20}
                  color="#ffffff"
                  />
                }
                 
            title="Snap"
            buttonStyle={{backgroundColor: "#009788"}}
            type="solid"
            onPress={async () => {
              setIsVisible(true);
              if (cameraRef) {
                let photo = await cameraRef.takePictureAsync({  quality : 0.7,
                  base64: true,
                  exif: true});
                setIsVisible(false);

                var data = new FormData();
                
                data.append('avatar', {
                  uri: photo.uri,
                  type: 'image/jpeg',
                  name: 'avatar.jpg',
                });




                var rawResponse = await fetch("http://192.168.10.118:3000/upload", {
                  method: 'post',
                  body: data
                  });;

                  var response = await rawResponse.json();
                  console.log("Reponse front",response);

                  if (!response.error) {
                    props.onSnap(response);
         
                   }
                   setIsVisible(false);
              }

            }}
        />
  
      </Camera>

    )
  } else {return(cameraDisplay = <View style={{ flex: 1 }}></View>)}


}

function mapDispatchToProps(dispatch) {
  return {
    onSnap: function(pictureData) {
      dispatch({type: 'addPicture', pictureData })
    }
  }
 }

export default connect(
  null,
  mapDispatchToProps,
)(SnapScreen);
